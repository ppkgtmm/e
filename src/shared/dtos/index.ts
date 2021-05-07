import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { MINYEAR } from '../constants';
import { Interval } from '../enums';

const intervals = Object.values(Interval).join(', ');

export class EventDTO {
  @Max(31)
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  date: number;

  @Max(12)
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  month: number;

  @Min(MINYEAR)
  @IsInt()
  @IsNotEmpty()
  year: number;

  @Max(23)
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  start_hour: number;

  @Max(59)
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  start_minute: number;

  @Max(23)
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  end_hour: number;

  @Max(59)
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  end_minute: number;

  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  notes: string;

  @IsEnum(Interval, {
    message: `repeat interval should be one of ${intervals}`,
  })
  @IsOptional()
  repeat_interval: Interval;
}

export class GetEventDTO {
  @Max(31)
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  date: number;

  @Max(12)
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  month: number;

  @Min(MINYEAR)
  @IsInt()
  @IsNotEmpty()
  year: number;
}
