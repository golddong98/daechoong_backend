import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { SmallCatesModule } from '../small-cates/small-cates.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/common/utils/multer.options';
import { File } from 'src/database/entities/files.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([File]),
    UsersModule,
    SmallCatesModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
