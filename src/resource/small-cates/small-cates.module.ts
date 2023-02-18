import { SmallCate } from './../../database/entities/small-cates.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmallCatesService } from './small-cates.service';
import { SmallCatesController } from './small-cates.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { MediumCatesModule } from '../medium-cates/medium-cates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmallCate]),
    UsersModule,
    MediumCatesModule,
  ],
  controllers: [SmallCatesController],
  providers: [SmallCatesService],
})
export class SmallCatesModule {}
