import { User } from 'src/database/entities/users.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
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

  async getLargeCateById(id: number) {
    try {
      const largeCate = await this.largeCatesRepository.findOne({ id });
      if (!largeCate) throw new Error();
      return largeCate;
    } catch (error) {
      throw new BadRequestException('해당하는 대분류를 찾을 수 없습니다.');
    }
  }
}
