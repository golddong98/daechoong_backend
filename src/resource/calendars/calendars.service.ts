import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calendar } from 'src/database/entities/calendars.entity';

@Injectable()
export class CalendarsService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarsRepository: Repository<Calendar>,
  ) {}

  getCalendars(): string {
    return 'Hello Calendars!';
  }
}
