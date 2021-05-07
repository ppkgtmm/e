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
  // @Column('int')
  // date: number;

  // @Column('int')
  // day: number;

  // @Column('int')
  // month: number;

  // @Column('int')
  // year: number;

  // @Column('int')
  // start_hour: number;

  // @Column('int')
  // start_minute: number;

  // @Column('int')
  // end_hour: number;

  // @Column('int')
  // end_minute: number;

  @Column('text')
  notes: string;

  @Column('text', { default: null })
  repeat_interval: Interval;
}
