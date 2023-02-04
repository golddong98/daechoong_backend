import { Note } from './notes.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Common } from './common.entity';

@Entity()
export class SmallCate extends Common {
  @Column({ length: 50 })
  name: string;

  @OneToMany(() => Note, (note) => note.smallCate)
  notes: Note[];
}
