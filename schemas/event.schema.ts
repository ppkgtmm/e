import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Recurrence, RecurrenceSchema } from './recurrence.schema';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true })
  date: number;

  @Prop({ required: true, min: 0, max: 23 })
  start_hour: number;

  @Prop({ required: true, min: 0, max: 59 })
  start_minute: number;

  @Prop({ required: true, min: 0, max: 23 })
  end_hour: number;

  @Prop({ required: true, min: 0, max: 59 })
  end_minute: number;

  @Prop({ type: RecurrenceSchema })
  recurrence: Recurrence;
}

export const EventSchema = SchemaFactory.createForClass(Event);
