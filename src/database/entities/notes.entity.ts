import { SmallCate } from './small-cates.entity';
import { File } from './files.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Common } from './common.entity';
import { User } from './users.entity';

@Entity()
export class Note extends Common {
  @Column('text')
  content: string;

  @OneToMany(() => File, (file) => file.note)
  files: File[];

  @ManyToOne(() => User, (user) => user.notes)
  user: User;

  @ManyToOne(() => SmallCate, (smallCate) => smallCate.notes)
  smallCate: SmallCate;
}
