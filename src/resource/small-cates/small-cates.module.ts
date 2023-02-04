import { SmallCate } from './../../database/entities/small-cates.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmallCatesService } from './small-cates.service';
import { SmallCatesController } from './small-cates.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([SmallCate])],
  controllers: [SmallCatesController],
  providers: [SmallCatesService],
})
export class SmallCatesModule {}
