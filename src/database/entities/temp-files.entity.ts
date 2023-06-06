import { TempNote } from './temp-notes.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Common } from './common.entity';
import { User } from './users.entity';

@Entity()
export class TempFile extends Common {
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

  @ManyToOne(() => TempNote, (tempNote) => tempNote.tempFiles, {
    onDelete: 'CASCADE',
  })
  tempNote: TempNote;

  @ManyToOne(() => User, (user) => user.tempFiles, {
    onDelete: 'CASCADE',
  })
  user: User;
}
