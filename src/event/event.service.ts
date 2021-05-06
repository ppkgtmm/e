import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  badRequestExceptionThrower,
  getMonthDays,
  isLeapYear,
} from 'src/shared/functions';
import { Event, EventDocument } from '../schemas/event.schema';
import { EventDTO } from '../shared/dtos';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  getPackedDate(event: EventDTO) {
    const timeStamp = new Date(event.year, event.month, event.date);
    timeStamp.setHours(0, 0);
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
  async createEvent(event: EventDTO) {
    this.validateInput(event);
    const {
      start_hour,
      start_minute,
      end_hour,
      end_minute,
      notes,
      repeat_interval,
    } = event;
    const timeStamp = this.getPackedDate(event);
    const newEvent = new this.eventModel({
      date: timeStamp,
      start_hour,
      end_hour,
      start_minute,
      end_minute,
      notes,
      repeat_interval,
    });
    return await newEvent.save();
  }
}
