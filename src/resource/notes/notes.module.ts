import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/common/utils/multer.options';
import { Note } from 'src/database/entities/notes.entity';
import { FilesModule } from '../files/files.module';
import { SmallCatesModule } from '../small-cates/small-cates.module';
import { MediumCatesModule } from '../medium-cates/medium-cates.module';
import { LargeCatesModule } from '../large-cates/large-cates.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Note]),
    UsersModule,
    FilesModule,
    SmallCatesModule,
    MediumCatesModule,
    LargeCatesModule,
  ],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}
