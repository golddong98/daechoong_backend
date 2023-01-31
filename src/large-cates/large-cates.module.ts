import { LargeCatesController } from './large-cates.controller';
import { LargeCatesService } from './large-cates.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [LargeCatesController],
  providers: [LargeCatesService],
})
export class LargeCatesModule {}
