import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { range } from 'src/common/utils/functions';
import { Cate } from 'src/database/entities/cates.entity';
import { Repository } from 'typeorm';
// import { MediumCatesService } from '../medium-cates/medium-cates.service';

@Injectable()
export class CatesService {
  constructor(
    @InjectRepository(Cate)
    private readonly catesRepository: Repository<Cate>,
  ) {}

  getCates(): string {
    return 'Hello Cates!';
  }

  async checkPermissionSmallCate({ userId, cateId }) {
    try {
      const confirmedSmallCate = await this.catesRepository.findOne({
        relations: ['mediumCate', 'largeCate'],
        where: {
          id: cateId,
          user: userId,
        },
      });
      if (!confirmedSmallCate) {
        throw new Error();
      }
      return { confirmedSmallCate };
    } catch (error) {
      throw new BadRequestException('소분류를 변경할 권한이 없습니다.');
    }
  }

  async createSmallCates({
    // largeCateId,
    // mediumCateId,
    smallCateCreateDTO,
    userId,
  }) {
    const smallCate = this.catesRepository.create({
      name: smallCateCreateDTO.smallCateName,
      // startedAt: smallCateCreateDTO.startedAt,
      // endedAt: smallCateCreateDTO.endedAt,
      user: userId,
      // mediumCate: mediumCateId,
      // largeCate: largeCateId,
    });
    await this.catesRepository.insert(smallCate);
    return smallCate;
  }

  async updateSmallCates({ smallCateId, smallCateNameUpdateDTO }) {
    const mediumCate = this.catesRepository.create({
      name: smallCateNameUpdateDTO.smallCateName,
    });
    const updateResult = await this.catesRepository.update(
      smallCateId,
      mediumCate,
    );
    if (updateResult.affected > 0) {
      return this.catesRepository.findOne({
        select: ['id', 'name', 'startedAt', 'endedAt'],
        where: { id: smallCateId },
      });
    } else {
      throw new NotFoundException(`소분류 수정 중 오류가 났습니다.`);
    }
  }

  async deleteSmallCates({ smallCateId }) {
    return await this.catesRepository.delete(smallCateId);
  }

  async getSmallCateById({ smallCateId }) {
    return await this.catesRepository.findOne({ id: smallCateId });
  }

  async getSmallCatesByYearAndMonth({ year, month, userId }) {
    const fromDate = new Date(year, month - 1, 1);
    const toDate = new Date(year, month, 0);

    return await this.catesRepository
      .createQueryBuilder('small_cate')
      .select([
        'small_cate.id',
        'small_cate.name',
        'medium_cate.id',
        'medium_cate.name',
        'large_cate.id',
        'large_cate.name',
      ])
      .leftJoin('small_cate.mediumCate', 'medium_cate')
      .leftJoin('small_cate.largeCate', 'large_cate')
      .where(
        `startedAt <= '${toDate.toISOString()}' AND endedAt >= '${fromDate.toISOString()}' AND small_cate.userId = ${userId}`,
      )
      .getMany();
  }

  async getSmallCatesByMediumCateId({ id: mediumCateId }) {
    return await this.catesRepository.find({
      select: ['id', 'name'],
      where: {
        mediumCate: mediumCateId,
      },
    });
  }

  async getAllSmallCatesByYear({ userId }) {
    const smallCates = await this.catesRepository.find({
      select: ['id', 'name', 'startedAt', 'endedAt'],
      where: {
        user: userId,
      },
    });

    const smallCatesByYear: { [key: number]: Cate[] } = {};
    for (const smallCate of smallCates) {
      const startedAtYear = smallCate.startedAt.getFullYear();
      const endedAtYear = smallCate.endedAt
        ? smallCate.endedAt.getFullYear()
        : new Date().getFullYear();

      const years = range(startedAtYear, endedAtYear);

      years.forEach((year) => {
        if (!smallCatesByYear[year]) {
          smallCatesByYear[year] = [];
        }
        smallCatesByYear[year].push(smallCate);
      });
    }

    return smallCatesByYear;
  }
}
