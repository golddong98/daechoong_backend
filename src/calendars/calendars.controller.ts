import { CalendarsService } from './calendars.service';
import { Controller, Get } from '@nestjs/common';

@Controller('calendars')
export class CalendarsController {
  constructor(private readonly calendarsCatesService: CalendarsService) {}

  @Get()
  getCalendars(): string {
    return this.calendarsCatesService.getCalendars();
  }
}
