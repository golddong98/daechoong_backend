import { Note } from './notes.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Common } from './common.entity';

@Entity()
export class User extends Common {
  @Column({ length: 50 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 50 })
  schoolName: string;

  @Column('int')
  studentNumber: number;

  @Column({ length: 50 })
  major1: string;

  @Column({ length: 50 })
  major2: string;

  @Column('text')
  profileImgUrl: string;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];
}
