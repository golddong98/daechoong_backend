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

  async getLargeCates({ userId }) {
    return await this.largeCatesRepository.find({
      relations: ['mediumCates'],
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async createLargeCatesAuto({ name, user }) {
    const largeCate = this.largeCatesRepository.create({
      name,
      user,
    });
    return await this.largeCatesRepository.insert(largeCate);
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
