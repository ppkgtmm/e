import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Interval } from '../enums';

const intervals = Object.values(Interval).join(', ');

export class EventDTO {
  @IsDateString()
  @IsNotEmpty()
  date: string;

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

  @IsEnum(Interval, {
    message: `repeat interval should be one of ${intervals}`,
  })
  @IsOptional()
  repeat_interval: Interval;
}
