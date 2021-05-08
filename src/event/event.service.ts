import { Injectable } from '@nestjs/common';
import { Interval } from '../shared/enums';
import {
  badRequestExceptionThrower,
  getMonthDays,
  isLeapYear,
} from '../shared/functions';
import { getConnection } from 'typeorm';
import { Event } from '../schemas/event.entity';
import { EventDTO, GetEventDTO } from '../shared/dtos';
import { OFFSET } from '../shared/constants';

@Injectable()
export class EventService {
  // returns date for specified time offset
  getPackedDate(event: EventDTO) {
    const timeStamp = new Date(
      `${event.year}-${event.month}-${event.date} ${OFFSET}`,
    );
    return timeStamp;
  }

  // ensures that date is a valid date for corresponding month
  validateMonthDate(event: EventDTO | GetEventDTO) {
    const { date, month, year } = event;
    const maxDate = getMonthDays(isLeapYear(year), month);
    badRequestExceptionThrower(
      date > maxDate,
      `Invalid date for month ${month}`,
    );
  }

  // ensures if event ending time comes after starting time
  validateEventTimeOrder(event: EventDTO) {
    const { start_hour, start_minute, end_hour, end_minute } = event;
    badRequestExceptionThrower(
      start_hour > end_hour ||
        (start_hour === end_hour && start_minute >= end_minute),
      'Event ending time must be after starting time',
    );
  }

  // return whether recurring interval is daily or not
  static doesDailyRecurr(interval: Interval) {
    return interval === Interval.DAILY;
  }

  // return whether event in past recurr weekly and overlap with event in future
  // interval = recurring interval of past event
  static doesWeeklyOverlap(interval: Interval, past: Date, future: Date) {
    return interval === Interval.WEEKLY && past.getDay() === future.getDay();
  }

  // return whether event in past recurr monthly and overlap with event in future
  // interval = recurring interval of past event
  static doesMonthlyOverlap(interval: Interval, past: Date, future: Date) {
    if (interval !== Interval.MONTHLY) return false;
    const isLeap = isLeapYear(future.getFullYear());
    const maxMonthdays = getMonthDays(isLeap, future.getMonth() + 1);
    // e.g. if event is scheduled on 31, months that have days less than 31 will have the event at end of the month
    // check for end of month shifted past events
    if (future.getDate() === maxMonthdays && past.getDate() >= maxMonthdays)
      return true;
    return future.getDate() === past.getDate(); // check for date which exist in all months
  }

  static doesYearlyOverlap(interval: Interval, past: Date, future: Date) {
    if (interval !== Interval.YEARLY) return false;
    if (past.getMonth() !== future.getMonth()) return false;
    return this.doesMonthlyOverlap(Interval.MONTHLY, past, future);
  }

  doesOverlapWithPastEvent(pastEvent: Event, targetDate: Date) {
    const { repeat_interval, date } = pastEvent;
    if (!repeat_interval) return false;
    const eventDate = new Date(`${date} ${OFFSET}`);
    if (EventService.doesDailyRecurr(repeat_interval)) return true;
    if (EventService.doesWeeklyOverlap(repeat_interval, eventDate, targetDate))
      return true;
    if (EventService.doesMonthlyOverlap(repeat_interval, eventDate, targetDate))
      return true;
    return EventService.doesYearlyOverlap(
      repeat_interval,
      eventDate,
      targetDate,
    );
  }

  doesOverlapWithFutureEvent(
    futureEvent: Event,
    targetEvent: EventDTO,
    targetDate: Date,
  ) {
    const eventDate = new Date(`${futureEvent.date} ${OFFSET}`);
    const future_interval = futureEvent.repeat_interval;
    const target_interval = targetEvent.repeat_interval;
    if (!target_interval) return false;
    if (
      EventService.doesDailyRecurr(future_interval) ||
      EventService.doesDailyRecurr(target_interval)
    )
      return true;
    if (EventService.doesWeeklyOverlap(target_interval, targetDate, eventDate))
      return true;
    if (EventService.doesMonthlyOverlap(target_interval, targetDate, eventDate))
      return true;
    return EventService.doesYearlyOverlap(
      target_interval,
      targetDate,
      eventDate,
    );
  }
  async getOverlappingTimeEvent(event: EventDTO) {
    return await getConnection()
      .createQueryBuilder()
      .from(Event, 'event')
      .where(
        '(event.start_time >= TIME(:start_time)AND event.start_time < TIME(:end_time)) \
        OR (event.end_time > TIME(:start_time) AND event.end_time <= TIME(:end_time)) \
        OR (event.start_time <= TIME(:start_time) AND event.end_time >= TIME(:end_time))',
        {
          start_time: `${event.start_hour}:${event.start_minute}`,
          end_time: `${event.end_hour}:${event.end_minute}`,
        },
      )
      .getRawMany();
  }
  selectEventsToCompare(events: Event[], target: EventDTO, targetDate: Date) {
    const result = [];
    for (const event of events) {
      const eventDate = new Date(`${event.date} ${OFFSET}`);
      if (eventDate.toDateString() === targetDate.toDateString()) {
        result.push(event);
      } else if (
        eventDate.getTime() < targetDate.getTime() &&
        this.doesOverlapWithPastEvent(event, targetDate)
      ) {
        result.push(event);
      } else if (
        eventDate.getTime() > targetDate.getTime() &&
        this.doesOverlapWithFutureEvent(event, target, targetDate)
      ) {
        result.push(event);
      }
    }
    return result;
  }
  async validateNonOverlapping(event: EventDTO, eventDate: Date) {
    const overlappingTime = await this.getOverlappingTimeEvent(event);
    if (!overlappingTime || overlappingTime.length === 0) return;
    const cleanedEvents = this.selectEventsToCompare(
      overlappingTime,
      event,
      eventDate,
    );
    badRequestExceptionThrower(
      cleanedEvents.length > 0,
      'overlapping events are not allowed',
    );
  }
  async createEvent(event: EventDTO) {
    this.validateMonthDate(event);
    this.validateEventTimeOrder(event);
    const eventDate = this.getPackedDate(event);
    await this.validateNonOverlapping(event, eventDate);
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Event)
      .values({
        date: `${eventDate.getFullYear()}-${
          eventDate.getMonth() + 1
        }-${eventDate.getDate()}`,
        start_time: `${event.start_hour}:${event.start_minute}`,
        end_time: `${event.end_hour}:${event.end_minute}`,
        notes: event.notes,
        repeat_interval: event.repeat_interval,
      })
      .execute();
  }

  async getEventsByDate(input: GetEventDTO) {
    this.validateMonthDate(input);
  }
}
