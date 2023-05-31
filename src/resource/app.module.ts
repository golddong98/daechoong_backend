import { DatabaseModule } from 'src/database/database.module';
// import Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { CatesModule } from './cates/cates.module';
// import { MediumCatesModule } from './medium-cates/medium-cates.module';
// import { LargeCatesModule } from './large-cates/large-cates.module';
import { CalendarsModule } from './calendars/calendars.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    DatabaseModule,
    NotesModule,
    CatesModule,
    // MediumCatesModule,
    // LargeCatesModule,
    CalendarsModule,
    UsersModule,
    FilesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
