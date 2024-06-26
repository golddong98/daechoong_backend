import { Note } from './notes.entity';
import { Entity, Column, OneToMany, ManyToOne, OneToOne } from 'typeorm';
import { Common } from './common.entity';
import { User } from './users.entity';
import { TempNote } from './temp-notes.entity';
// import { MediumCate } from './medium-cates.entity';
// import { LargeCate } from './large-cates.entity';

@Entity()
export class Cate extends Common {
  @Column({ length: 50 })
  name: string;

  @OneToMany(() => Note, (note) => note.cate)
  notes: Note[];

  @ManyToOne(() => User, (user) => user.cates, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToOne(() => TempNote, (tempNote) => tempNote.cate)
  tempNote: TempNote;

  @Column({ type: 'boolean', default: false })
  isTempNote: boolean;

  // @ManyToOne(() => LargeCate, (largeCate) => largeCate.smallCates, {
  //   onDelete: 'CASCADE',
  // })
  // largeCate: LargeCate;

  // @ManyToOne(() => MediumCate, (mediumCate) => mediumCate.smallCates, {
  //   onDelete: 'CASCADE',
  // })
  // mediumCate: MediumCate;

  // @Column()
  // startedAt: Date;

  // @Column({ nullable: true })
  // endedAt: Date;
}
