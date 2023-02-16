import { LargeCate } from './../../database/entities/large-cates.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LargeCatesController } from './large-cates.controller';
import { LargeCatesService } from './large-cates.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([LargeCate])],
  controllers: [LargeCatesController],
  providers: [LargeCatesService],
  exports: [LargeCatesService, TypeOrmModule],
})
export class LargeCatesModule {}
