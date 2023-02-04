import { Note } from './notes.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Common } from './common.entity';

@Entity()
export class File extends Common {
  @Column('text')
  fileUrl: string;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Note, (note) => note.files)
  note: Note;
}
