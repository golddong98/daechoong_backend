import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from 'src/database/entities/calendars.entity';
import { CalendarsController } from './calendars.controller';
import { CalendarsService } from './calendars.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar])],
  controllers: [CalendarsController],
  providers: [CalendarsService],
})
export class CalendarsModule {}
