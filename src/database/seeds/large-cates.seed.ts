import { LargeCate } from '../entities/large-cates.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export default class CreateLargeCates implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const largeCateData = [
      { name: '교과' },
      { name: '비교과' },
      { name: '기타' },
    ];

    await connection
      .createQueryBuilder()
      .insert()
      .into(LargeCate)
      .values(largeCateData)
      .execute();
  }
}
