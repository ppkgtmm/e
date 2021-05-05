import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecurrenceDocument = Recurrence & Document;

@Schema({ _id: false })
export class Recurrence {
  @Prop({ default: null })
  interval: string;

  @Prop({ default: 0 })
  frequency: number;
}

export const RecurrenceSchema = SchemaFactory.createForClass(Recurrence);
