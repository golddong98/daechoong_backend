import { Cate } from './cates.entity';
import { TempFile } from './temp-files.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
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

  @OneToOne(() => Cate, (cate) => cate.tempNote, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  cate: Cate;
}
