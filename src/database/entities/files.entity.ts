import { Note } from './notes.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Common } from './common.entity';
import { User } from './users.entity';

@Entity()
export class File extends Common {
  @Column('text')
  fileUrl: string;

  @Column({ length: 100 })
  originalName: string;

  @Column({ length: 50 })
  mimeType: string;

  @Column({ length: 50 })
  encoding: string;

  @Column()
  size: number;

  @ManyToOne(() => Note, (note) => note.files, {
    onDelete: 'CASCADE',
  })
  note: Note;

  @ManyToOne(() => User, (user) => user.files, {
    onDelete: 'CASCADE',
  })
  user: User;
}
