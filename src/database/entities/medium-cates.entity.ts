import { Entity, Column, ManyToOne } from 'typeorm';
import { Common } from './common.entity';
import { LargeCate } from './large-cates.entity';
import { User } from './users.entity';

@Entity()
export class MediumCate extends Common {
  @Column({ length: 50 })
  name: string;

  @ManyToOne(() => User, (user) => user.mediumCates)
  user: User;

  @ManyToOne(() => LargeCate, (largeCate) => largeCate.mediumCates)
  largeCate: LargeCate;
}
