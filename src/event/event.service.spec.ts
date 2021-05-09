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
  const feb28NextYear = getDate(2013, 2, 28);
  const may31 = getDate(2012, 5, 31);
  const jun30 = getDate(2012, 6, 30);
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
  });
});
