import { DataSource } from 'typeorm';
import { SmallCate } from '../../database/entities/small-cates.entity';

export const smallCatesProviders = [
  {
    provide: 'SMALLCATES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SmallCate),
    inject: ['DATA_SOURCE'],
  },
];
