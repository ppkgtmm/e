import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Interval } from '../shared/enums';

export type EventDocument = Event & Document;

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('date')
  date: string;

  @Column('time')
  start_time: string;

  @Column('time')
  end_time: string;

  @Column('text')
  notes: string;

  @Column('text', { default: null })
  repeat_interval: Interval;
}
