import { Cate } from './cates.entity';
import { TempFile } from './temp-files.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Common } from './common.entity';
import { User } from './users.entity';

@Entity()
export class TempNote extends Common {
  @Column('text')
  content: string;

  @OneToMany(() => TempFile, (tempFile) => tempFile.tempNote)
  tempFiles: Promise<TempFile[]>;

  @ManyToOne(() => User, (user) => user.tempNotes, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Cate, (cate) => cate.notes, {
    onDelete: 'CASCADE',
  })
  cate: Cate;
}
