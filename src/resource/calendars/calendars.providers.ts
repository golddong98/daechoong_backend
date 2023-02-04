import { DataSource } from 'typeorm';
import { Calendar } from 'src/database/entities/calendars.entity';

export const calendarsProviders = [
  {
    provide: 'CALENDARS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Calendar),
    inject: ['DATA_SOURCE'],
  },
];
