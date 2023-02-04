import { Injectable } from '@nestjs/common';

@Injectable()
export class CalendarsService {
  getCalendars(): string {
    return 'Hello Calendars!';
  }
}
