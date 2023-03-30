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

  async checkPermissionLargeCate({ userId, largeCateId }) {
    try {
      const confirmedLargeCate = await this.largeCatesRepository.findOne({
        where: { id: largeCateId, user: userId },
      });

      if (!confirmedLargeCate) {
        throw new Error();
      }

      return { confirmedLargeCate };
    } catch (error) {
      throw new BadRequestException('대분류에 항목을 변경할 권한이 없습니다.');
    }
  }

  async getLargeCates({ userId }) {
    return await this.largeCatesRepository
      .createQueryBuilder('large_cate')
      .select([
        'large_cate.id',
        'large_cate.name',
        'medium_cate.id',
        'medium_cate.name',
        // small cate도 추가적으로 같이 불러오고 싶을 시 주석풀면됨
        // 'small_cate.id',
        // 'small_cate.name',
      ])
      .leftJoin('large_cate.mediumCates', 'medium_cate')
      // .leftJoin('medium_cate.smallCates', 'small_cate')
      .where(`large_cate.userId = ${userId}`)
      .orderBy('large_cate.id', 'ASC')
      .getMany();
  }

  async createLargeCatesAuto({ name, userId }) {
    const largeCate = this.largeCatesRepository.create({
      name,
      user: userId,
    });
    await this.largeCatesRepository.insert(largeCate);
    return largeCate;
  }

  async getLargeCateById({ id }) {
    try {
      const largeCate = await this.largeCatesRepository.findOne({ id });
      if (!largeCate) throw new Error();
      return largeCate;
    } catch (error) {
      throw new BadRequestException('해당하는 대분류를 찾을 수 없습니다.');
    }
  }
}
