import { TypeOrmModule } from '@nestjs/typeorm';
import { MediumCate } from './../../database/entities/medium-cates.entity';
import { MediumCatesService } from './medium-cates.service';
import { MediumCatesController } from './medium-cates.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([MediumCate])],
  controllers: [MediumCatesController],
  providers: [MediumCatesService],
})
export class MediumCatesModule {}
