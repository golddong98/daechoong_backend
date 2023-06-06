import { TypeOrmModule } from '@nestjs/typeorm';
import { TempNotesController } from './temp-notes.controller';
import { TempNotesService } from './temp-notes.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/common/utils/multer.options';
import { TempNote } from 'src/database/entities/temp-notes.entity';
import { FilesModule } from '../files/files.module';
import { CatesModule } from '../cates/cates.module';
// import { MediumCatesModule } from '../medium-cates/medium-cates.module';
// import { LargeCatesModule } from '../large-cates/large-cates.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([TempNote]),
    UsersModule,
    FilesModule,
    CatesModule,
    // MediumCatesModule,
    // LargeCatesModule,
  ],
  controllers: [TempNotesController],
  providers: [TempNotesService],
  exports: [TempNotesService],
})
export class TempNoteModule {}
