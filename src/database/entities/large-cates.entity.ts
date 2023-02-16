import { Entity, Column, ManyToOne } from 'typeorm';
import { Common } from './common.entity';
import { User } from './users.entity';

@Entity()
export class LargeCate extends Common {
  @Column({ length: 50 })
  name: string;

  @ManyToOne(() => User, (user) => user.largeCates)
  user: User;
}
