import { Test, TestingModule } from '@nestjs/testing';
import { OFFSET } from '../shared/constants';
import { Interval } from '../shared/enums';
import { EventService } from './event.service';

function getDate(year: number, month: number, date: number) {
  return new Date(`${year}-${month}-${date} ${OFFSET}`);
}

describe('EventService', () => {
  let service: EventService;
  const mar6 = getDate(2012, 3, 6);
  const apr6 = getDate(2012, 4, 6);
  const mar7 = getDate(2012, 3, 7);
  const mar6NextYear = getDate(2013, 3, 6);
  const mar13 = getDate(2012, 3, 13);
  const feb29 = getDate(2012, 2, 29);
  const nextFeb29 = getDate(2016, 2, 29);
  const feb28NextYear = getDate(2013, 2, 28);
  const may31 = getDate(2012, 5, 31);
  const jun30 = getDate(2012, 6, 30);
  const pastEvent = {
    notes: 'abcd',
    date: '2020-02-29',
    id: null,
    start_time: '10:30',
    end_time: '10:45',
    repeat_interval: Interval.MONTHLY,
  };
  const futureEvent = {
    notes: 'abcd',
    date: '2028-02-29',
    id: null,
    start_time: '10:30',
    end_time: '10:45',
    repeat_interval: Interval.YEARLY,
  };
  const presentEvent = {
    notes: 'abcd',
    date: '2024-02-29',
    id: null,
    start_time: '10:30',
    end_time: '10:45',
    repeat_interval: null,
  };
  const extraEvent = {
    notes: 'abcd',
    date: '2028-03-31',
    id: null,
    start_time: '10:30',
    end_time: '10:45',
    repeat_interval: null,
  };
  const events = [pastEvent, futureEvent, presentEvent, extraEvent];
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
    const inputs = [
      { date: 29, month: 2, year: 2021 },
      { date: 31, month: 4, year: 2021 },
    ];
    expect(() => EventService.validateMonthDate(inputs[0])).toThrow(
      `Invalid date for month ${inputs[0].month}`,
    );
    expect(() =>
      EventService.validateMonthDate({ ...inputs[0], year: 2020 }),
    ).not.toThrow(`Invalid date for month ${inputs[0].month}`);

    expect(() => EventService.validateMonthDate(inputs[1])).toThrow(
      `Invalid date for month ${inputs[1].month}`,
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

  it('should thorw error for invalid event time order', () => {
    expect(() =>
      EventService.validateEventTimeOrder({
        start_hour: 23,
        start_minute: 23,
        end_hour: 21,
        end_minute: 20,
        date: 12,
        month: 11,
        year: 1988,
        notes: 'abcd',
        repeat_interval: null,
      }),
    ).toThrow('Event ending time must be after starting time');
  });

  it('should correctly detect daily recurrence', () => {
    expect(EventService.doesDailyRecurr(Interval.MONTHLY)).toBeFalsy();
    expect(EventService.doesDailyRecurr(Interval.DAILY)).toBeTruthy();
  });

  it('should correctly detect overlap from weekly recurrence', () => {
    expect(
      EventService.doesWeeklyOverlap(Interval.MONTHLY, mar6, mar13),
    ).toBeFalsy();
    expect(
      EventService.doesWeeklyOverlap(Interval.WEEKLY, mar6, mar7),
    ).toBeFalsy();
    expect(
      EventService.doesWeeklyOverlap(Interval.WEEKLY, mar6, apr6),
    ).toBeFalsy();
    expect(
      EventService.doesWeeklyOverlap(Interval.WEEKLY, mar6, mar6NextYear),
    ).toBeFalsy();
    expect(
      EventService.doesWeeklyOverlap(Interval.WEEKLY, mar6, mar13),
    ).toBeTruthy();
    expect(
      EventService.doesWeeklyOverlap(Interval.WEEKLY, mar6, mar6),
    ).toBeTruthy();
  });

  it('should correctly detect monthly recurrence', () => {
    expect(
      EventService.doesMonthlyOverlap(Interval.WEEKLY, mar6, apr6),
    ).toBeFalsy();
    expect(
      EventService.doesMonthlyOverlap(Interval.MONTHLY, mar6, mar7),
    ).toBeFalsy();
    expect(
      EventService.doesMonthlyOverlap(Interval.MONTHLY, mar6, mar13),
    ).toBeFalsy();
    expect(
      EventService.doesMonthlyOverlap(Interval.MONTHLY, mar6, mar6NextYear),
    ).toBeTruthy();
    expect(
      EventService.doesMonthlyOverlap(Interval.MONTHLY, mar6, apr6),
    ).toBeTruthy();
    expect(
      EventService.doesMonthlyOverlap(Interval.MONTHLY, feb29, feb28NextYear),
    ).toBeTruthy();
    expect(
      EventService.doesMonthlyOverlap(Interval.MONTHLY, may31, feb28NextYear),
    ).toBeTruthy();
    expect(
      EventService.doesMonthlyOverlap(Interval.MONTHLY, may31, jun30),
    ).toBeTruthy();
    expect(
      EventService.doesMonthlyOverlap(Interval.MONTHLY, feb29, feb29),
    ).toBeTruthy();
    expect(
      EventService.doesMonthlyOverlap(Interval.MONTHLY, feb29, nextFeb29),
    ).toBeTruthy();
  });

  it('should correctly detect yearly recurrence', () => {
    expect(
      EventService.doesYearlyOverlap(Interval.MONTHLY, mar6, apr6),
    ).toBeFalsy();
    expect(
      EventService.doesYearlyOverlap(Interval.YEARLY, mar6, mar7),
    ).toBeFalsy();
    expect(
      EventService.doesYearlyOverlap(Interval.YEARLY, mar6, mar13),
    ).toBeFalsy();
    expect(
      EventService.doesYearlyOverlap(Interval.YEARLY, mar6, mar6NextYear),
    ).toBeTruthy();
    expect(
      EventService.doesYearlyOverlap(Interval.YEARLY, mar6, apr6),
    ).toBeFalsy();
    expect(
      EventService.doesYearlyOverlap(Interval.YEARLY, feb29, feb28NextYear),
    ).toBeTruthy();
    expect(
      EventService.doesYearlyOverlap(Interval.YEARLY, may31, feb28NextYear),
    ).toBeFalsy();
    expect(
      EventService.doesYearlyOverlap(Interval.YEARLY, may31, jun30),
    ).toBeFalsy();
    expect(
      EventService.doesYearlyOverlap(Interval.YEARLY, feb29, feb29),
    ).toBeTruthy();
    expect(
      EventService.doesMonthlyOverlap(Interval.MONTHLY, feb29, nextFeb29),
    ).toBeTruthy();
  });

  it('should correctly detect overlap with past recurring event', () => {
    expect(
      EventService.doesOverlapWithPastEvent(
        { ...pastEvent, repeat_interval: null },
        getDate(2024, 2, 29),
      ),
    ).toBeFalsy();
    expect(
      EventService.doesOverlapWithPastEvent(
        { ...pastEvent, repeat_interval: Interval.YEARLY },
        getDate(2024, 2, 29),
      ),
    ).toBeTruthy();
  });

  it('should correctly detect overlap with future recurring event', () => {
    expect(
      EventService.doesOverlapWithFutureEvent(
        { ...futureEvent, repeat_interval: null },
        null,
        getDate(2024, 2, 29),
      ),
    ).toBeFalsy();
    expect(
      EventService.doesOverlapWithFutureEvent(
        futureEvent,
        Interval.YEARLY,
        getDate(2020, 2, 29),
      ),
    ).toBeTruthy();
    expect(
      EventService.doesOverlapWithFutureEvent(
        futureEvent,
        Interval.MONTHLY,
        getDate(2020, 3, 31),
      ),
    ).toBeTruthy();
  });

  it('should select correct events', () => {
    const filteredEvents = EventService.selectEvents(
      events,
      getDate(2024, 2, 29),
      Interval.MONTHLY,
    );
    expect(filteredEvents).toBeDefined();
    expect(filteredEvents).toHaveLength(events.length - 1);
    expect(filteredEvents).toEqual(events.slice(0, events.length - 1));
  });
});
