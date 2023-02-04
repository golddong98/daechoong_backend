import { DataSource } from 'typeorm';
import { MediumCate } from '../../database/entities/medium-cates.entity';

export const mediumCatesProviders = [
  {
    provide: 'MEDIUMCATES_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MediumCate),
    inject: ['DATA_SOURCE'],
  },
];
