import { User } from 'src/database/entities/users.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LargeCate } from 'src/database/entities/large-cates.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LargeCatesService {
  constructor(
    @InjectRepository(LargeCate)
    private readonly largeCatesRepository: Repository<LargeCate>,
  ) {}
  getLargeCates(): string {
    return 'Hello largeCates!';
  }

  async createLargeCates(user: User) {
    const largeCate1 = this.largeCatesRepository.create({
      name: '교과',
      user: user,
    });
    const largeCate2 = this.largeCatesRepository.create({
      name: '비교과',
      user: user,
    });
    const largeCate3 = this.largeCatesRepository.create({
      name: '기타',
      user: user,
    });
    await this.largeCatesRepository.insert(largeCate1);
    await this.largeCatesRepository.insert(largeCate2);
    await this.largeCatesRepository.insert(largeCate3);
    return;
  }
}
