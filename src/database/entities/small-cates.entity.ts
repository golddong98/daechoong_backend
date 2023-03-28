import { Note } from './notes.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Common } from './common.entity';
import { User } from './users.entity';
import { MediumCate } from './medium-cates.entity';
import { LargeCate } from './large-cates.entity';

@Entity()
export class SmallCate extends Common {
  @Column({ length: 50 })
  name: string;

  @OneToMany(() => Note, (note) => note.smallCate)
  notes: Note[];

  @ManyToOne(() => User, (user) => user.smallCates, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => LargeCate, (largeCate) => largeCate.smallCates, {
    onDelete: 'CASCADE',
  })
  largeCate: LargeCate;

  @ManyToOne(() => MediumCate, (mediumCate) => mediumCate.smallCates, {
    onDelete: 'CASCADE',
  })
  mediumCate: MediumCate;

  @Column()
  startedAt: Date;

  @Column({ nullable: true })
  endedAt: Date;
}
