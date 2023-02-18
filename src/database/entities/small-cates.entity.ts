import { Note } from './notes.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Common } from './common.entity';
import { User } from './users.entity';
import { MediumCate } from './medium-cates.entity';

@Entity()
export class SmallCate extends Common {
  @Column({ length: 50 })
  name: string;

  @OneToMany(() => Note, (note) => note.smallCate)
  notes: Note[];

  @ManyToOne(() => User, (user) => user.smallCates)
  user: User;

  @ManyToOne(() => MediumCate, (mediumCate) => mediumCate.smallCates)
  mediumCate: MediumCate;

  @Column()
  startedAt: Date;

  @Column()
  endedAt: Date;
}
