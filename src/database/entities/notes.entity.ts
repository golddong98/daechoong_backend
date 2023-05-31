import { Cate } from './cates.entity';
import { File } from './files.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Common } from './common.entity';
import { User } from './users.entity';
// import { LargeCate } from './large-cates.entity';
// import { MediumCate } from './medium-cates.entity';

@Entity()
export class Note extends Common {
  @Column('text')
  content: string;

  @OneToMany(() => File, (file) => file.note)
  files: Promise<File[]>;

  @ManyToOne(() => User, (user) => user.notes, {
    onDelete: 'CASCADE',
  })
  user: User;

  // @ManyToOne(() => LargeCate, (largeCate) => largeCate.notes, {
  //   onDelete: 'CASCADE',
  // })
  // largeCate: LargeCate;

  // @ManyToOne(() => MediumCate, (mediumCate) => mediumCate.notes, {
  //   onDelete: 'CASCADE',
  // })
  // mediumCate: MediumCate;

  @ManyToOne(() => Cate, (cate) => cate.notes, {
    onDelete: 'CASCADE',
  })
  cate: Cate;
}
