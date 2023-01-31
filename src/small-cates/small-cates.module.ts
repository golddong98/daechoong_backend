import { SmallCatesService } from './small-cates.service';
import { SmallCatesController } from './small-cates.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [SmallCatesController],
  providers: [SmallCatesService],
})
export class SmallCatesModule {}
