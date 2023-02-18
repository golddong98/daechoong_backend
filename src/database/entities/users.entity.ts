import { LargeCate } from './large-cates.entity';
import { Note } from './notes.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Common } from './common.entity';
import { MediumCate } from './medium-cates.entity';

@Entity()
export class User extends Common {
  @Column({ length: 50 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ nullable: true, length: 50 })
  schoolName: string;

  @Column({ nullable: true })
  studentNumber: number;

  @Column({ nullable: true, length: 50 })
  major1: string;

  @Column({ nullable: true, length: 50 })
  major2: string;

  @Column({ nullable: true })
  profileImgUrl: string;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(() => LargeCate, (largeCate) => largeCate.user)
  largeCates: Promise<LargeCate[]>;

  @OneToMany(() => MediumCate, (mediumCate) => mediumCate.user)
  mediumCates: Promise<MediumCate[]>;
}
