import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  badRequestExceptionThrower,
  getDay,
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

  async createEvent(event: EventDTO) {
    const {
      date,
      month,
      year,
      start_hour,
      start_minute,
      end_hour,
      end_minute,
      notes,
      repeat_interval,
    } = event;
    const maxDate = getMonthDays(isLeapYear(year), month);
    badRequestExceptionThrower(
      date > maxDate,
      `Invalid date for month ${month}`,
    );
    badRequestExceptionThrower(
      start_hour > end_hour ||
        (start_hour === end_hour && start_minute >= end_minute),
      'Event ending time must be after starting time',
    );

    const newEvent = new this.eventModel({
      date,
      month,
      year,
      day: getDay(year, month, date),
      start_hour,
      end_hour,
      start_minute,
      end_minute,
      notes,
      repeat_interval,
    });
  }
}

// const now = new Date();
// const currentDate = now.getDate();
// const currentMonth = now.getMonth() + 1; // month 0 - 11
// const currentYear = now.getFullYear();
// const currentminute = now.getMinutes();
// const currentHour = now.getHours();
