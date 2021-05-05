import { BadRequestException } from '@nestjs/common';
import { days } from '../constants';

export function getMonthDays(isLeap: boolean, month: number) {
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeap) monthDays[1] = 29;
  return monthDays[month - 1];
}

export function isLeapYear(year: number) {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  if (year % 4 === 0) return true;
  return false;
}

export function badRequestExceptionThrower(
  condition: boolean,
  message: string,
) {
  if (condition)
    throw new BadRequestException({
      message,
    });
}
export function getDay(year: number, month: number, date: number) {
  const dayNumber = new Date(`${year}-${month}-${date}`).getDay();
  return days[dayNumber];
}
