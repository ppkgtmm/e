import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  badRequestExceptionThrower,
  getMonthDays,
  isLeapYear,
} from 'src/shared/functions';
import { Repository } from 'typeorm';
import { Event } from '../schemas/event.entity';
import { EventDTO, GetEventDTO } from '../shared/dtos';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  getPackedDate(event: EventDTO) {
    const timeStamp = new Date(
      `${event.year}-${event.month}-${event.date} GMT+7:00`,
    );
    return timeStamp;
  }
  validateMonthDate(event: EventDTO) {
    const { date, month, year } = event;
    const maxDate = getMonthDays(isLeapYear(year), month);
    badRequestExceptionThrower(
      date > maxDate,
      `Invalid date for month ${month}`,
    );
  }
  validateEventTimeOrder(event: EventDTO) {
    const { start_hour, start_minute, end_hour, end_minute } = event;
    badRequestExceptionThrower(
      start_hour > end_hour ||
        (start_hour === end_hour && start_minute >= end_minute),
      'Event ending time must be after starting time',
    );
  }

  validateInput(event: EventDTO) {
    this.validateMonthDate(event);
    this.validateEventTimeOrder(event);
  }

  async doesOverlap(event: EventDTO) {
    const sameTimeEvents = await this.eventRepository.find();
    // .find({
    //   $or: [{ $and: [{}] }, { $and: [] }],
    // })
    // .exec();
  }
  async createEvent(event: EventDTO) {
    this.validateInput(event);
    const timeStamp = this.getPackedDate(event);
    const newEvent = new this.eventModel({
      date: timeStamp.getDate(),
      month: timeStamp.getMonth() + 1,
      year: timeStamp.getFullYear(),
      day: timeStamp.getDay(),
      start_hour: event.start_hour,
      end_hour: event.end_hour,
      start_minute: event.start_minute,
      end_minute: event.end_minute,
      notes: event.notes,
      repeat_interval: event.repeat_interval,
    });
    return await newEvent.save();
  }

  async getEventsByDate(range: GetEventDTO) {}
}
