import { DatabaseModule } from 'src/database/database.module';
// import Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { SmallCatesModule } from './small-cates/small-cates.module';
import { MediumCatesModule } from './medium-cates/medium-cates.module';
import { LargeCatesModule } from './large-cates/large-cates.module';
import { CalendarsModule } from './calendars/calendars.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      // validationSchema: Joi.object({
      //   NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
      //   DB_HOST: Joi.string().required(),
      //   DB_PORT: Joi.string().required(),
      //   DB_USERNAME: Joi.string().required(),
      //   DB_PASSWORD: Joi.string().required(),
      //   DB_DATABASE: Joi.string().required(),
      // }),
    }),
    DatabaseModule,
    NotesModule,
    SmallCatesModule,
    MediumCatesModule,
    LargeCatesModule,
    CalendarsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
