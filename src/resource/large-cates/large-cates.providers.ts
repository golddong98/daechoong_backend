import { DataSource } from 'typeorm';
import { LargeCate } from '../../database/entities/large-cates.entity';

export const largeCatesProviders = [
  {
    provide: 'LARGECATES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(LargeCate),
    inject: ['DATA_SOURCE'],
  },
];
