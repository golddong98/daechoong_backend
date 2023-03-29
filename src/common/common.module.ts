import { Module } from '@nestjs/common';
import { range } from './utils/functions';

@Module({
  exports: [range],
})
export class CommonModule {}
