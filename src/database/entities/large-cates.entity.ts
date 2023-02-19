import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Common } from './common.entity';
import { MediumCate } from './medium-cates.entity';
import { User } from './users.entity';

@Entity()
export class LargeCate extends Common {
  @Column({ length: 50 })
  name: string;

  @ManyToOne(() => User, (user) => user.largeCates, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => MediumCate, (mediumCate) => mediumCate.largeCate)
  mediumCates: MediumCate[];
}
