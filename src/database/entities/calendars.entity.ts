import { Entity, Column } from 'typeorm';
import { Common } from './common.entity';

@Entity()
export class Calendar extends Common {
  @Column('text')
  targetedAt: string;

  @Column('text')
  moodImgUrl: string;

  @Column('text')
  weatherImgUrl: string;
}
