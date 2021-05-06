import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Interval } from '../shared/enums';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true })
  date: Date;

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
