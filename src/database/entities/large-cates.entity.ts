import { Entity, Column } from 'typeorm';
import { Common } from './common.entity';

@Entity()
export class LargeCate extends Common {
  @Column({ length: 50 })
  name: string;
}
