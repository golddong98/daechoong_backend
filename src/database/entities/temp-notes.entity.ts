import { Cate } from './cates.entity';
import { File } from './files.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Common } from './common.entity';
import { User } from './users.entity';

@Entity()
export class TempNote extends Common {
  @Column('text')
  content: string;

  @OneToMany(() => File, (file) => file.note)
  files: Promise<File[]>;

  @ManyToOne(() => User, (user) => user.notes, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Cate, (cate) => cate.notes, {
    onDelete: 'CASCADE',
  })
  cate: Cate;
}
