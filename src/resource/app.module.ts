import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { SmallCatesModule } from './small-cates/small-cates.module';
import { MediumCatesModule } from './medium-cates/medium-cates.module';
import { LargeCatesModule } from './large-cates/large-cates.module';
import { CalendarsModule } from './calendars/calendars.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '111111',
      database: 'word',
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
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
