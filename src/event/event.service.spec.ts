import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create correct date object', () => {
    const input = { date: 20, month: 12, year: 1978 };
    const date = EventService.getPackedDate(input);
    expect(date).toBeDefined();
    expect(date).toBeInstanceOf(Date);
    expect(date.getDate()).toEqual(input.date);
    expect(date.getMonth()).toEqual(input.month - 1);
    expect(date.getFullYear()).toEqual(input.year);
  });

  it('should throw error for invalid month date', async () => {
    const input = { date: 29, month: 2, year: 2021 };
    expect(() => EventService.validateMonthDate(input)).toThrow(
      `Invalid date for month ${input.month}`,
    );
  });

  it('should thorw error for invalid event time order', () => {
    expect(() =>
      EventService.validateEventTimeOrder({
        start_hour: 23,
        start_minute: 23,
        end_hour: 23,
        end_minute: 20,
        date: 12,
        month: 11,
        year: 1988,
        notes: 'abcd',
        repeat_interval: null,
      }),
    ).toThrow('Event ending time must be after starting time');
  });
});
