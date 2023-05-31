// import { LargeCate } from './large-cates.entity';
import { Note } from './notes.entity';
import { Entity, Column, OneToMany } from 'typeorm';
// import { MediumCate } from './medium-cates.entity';
import { Cate } from './cates.entity';
import { File } from './files.entity';
import { ExistIdCommon } from './existIdCommon.entity';

@Entity()
export class User extends ExistIdCommon {
  @Column({ length: 50 })
  name: string;

  // @Column({ nullable: true, length: 100 })
  // email: string;

  // @Column({ nullable: true, length: 50 })
  // schoolName: string;

  // @Column({ nullable: true })
  // studentNumber: number;

  // @Column({ nullable: true, length: 50 })
  // major1: string;

  // @Column({ nullable: true, length: 50 })
  // major2: string;

  @Column({ nullable: true })
  profileImgUrl: string;

  // @Column({ type: 'boolean', default: false })
  // isActive: boolean;

  @OneToMany(() => Note, (note) => note.user)
  notes: Promise<Note[]>;

  @OneToMany(() => File, (file) => file.user)
  files: Promise<File[]>;

  // @OneToMany(() => LargeCate, (largeCate) => largeCate.user)
  // largeCates: Promise<LargeCate[]>;

  // @OneToMany(() => MediumCate, (mediumCate) => mediumCate.user)
  // mediumCates: Promise<MediumCate[]>;

  @OneToMany(() => Cate, (cate) => cate.user)
  cates: Promise<Cate[]>;
}
