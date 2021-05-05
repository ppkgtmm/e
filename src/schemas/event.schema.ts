import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Interval } from '../shared/enums';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true, min: 1, max: 31 })
  date: number;

  @Prop({ required: true })
  day: string;

  @Prop({ required: true, min: 1, max: 12 })
  month: number;

  @Prop({ required: true, min: 0 })
  year: number;

  @Prop({ required: true, min: 0, max: 23 })
  start_hour: number;

  @Prop({ required: true, min: 0, max: 59 })
  start_minute: number;

  @Prop({ required: true, min: 0, max: 23 })
  end_hour: number;

  @Prop({ required: true, min: 0, max: 59 })
  end_minute: number;

  @Prop({ required: true })
  notes: string;

  @Prop({ default: null })
  repeat_interval: Interval;
}

export const EventSchema = SchemaFactory.createForClass(Event);
