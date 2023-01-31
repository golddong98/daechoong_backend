import { CalendarsController } from './calendars.controller';
import { CalendarsService } from './calendars.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CalendarsController],
  providers: [CalendarsService],
})
export class CalendarsModule {}
