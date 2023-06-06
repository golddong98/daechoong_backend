import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { CatesModule } from '../cates/cates.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/common/utils/multer.options';
import { TempFile } from 'src/database/entities/temp-files.entity';
import { TempFilesController } from './temp-files.controller';
import { TempFilesService } from './temp-files.service';
import { TempNotesModule } from '../temp-notes/temp-notes.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([TempFile]),
    UsersModule,
    CatesModule,
    // 순환모듈임시방편 하나의 모듈만 import할수있도록 바꿔야됨
    forwardRef(() => TempNotesModule),
  ],
  controllers: [TempFilesController],
  providers: [TempFilesService],
  exports: [TempFilesService],
})
export class TempFilesModule {}
