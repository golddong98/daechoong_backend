import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { CatesModule } from '../cates/cates.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/common/utils/multer.options';
import { File } from 'src/database/entities/files.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { NotesModule } from '../notes/notes.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([File]),
    UsersModule,
    CatesModule,
    // 순환모듈임시방편 하나의 모듈만 import할수있도록 바꿔야됨
    forwardRef(() => NotesModule),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
