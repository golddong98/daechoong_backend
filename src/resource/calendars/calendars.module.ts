import { calendarsProviders } from './calendars.providers';
import { DatabaseModule } from './../../database/database.module';
import { CalendarsController } from './calendars.controller';
import { CalendarsService } from './calendars.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [CalendarsController],
  providers: [...calendarsProviders, CalendarsService],
})
export class CalendarsModule {}
