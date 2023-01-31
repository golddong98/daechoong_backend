import { MediumCatesService } from './medium-cates.service';
import { MediumCatesController } from './medium-cates.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [MediumCatesController],
  providers: [MediumCatesService],
})
export class MediumCatesModule {}
