import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { range } from 'src/common/utils/functions';
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

  async checkPermissionCate({ userId, cateId }) {
    try {
      const confirmedCate = await this.catesRepository.findOne({
        // relations: ['mediumCate', 'largeCate'],
        where: {
          id: cateId,
          user: userId,
        },
      });
      if (!confirmedCate) {
        throw new Error();
      }
      return { confirmedCate };
    } catch (error) {
      throw new BadRequestException('소분류를 변경할 권한이 없습니다.');
    }
  }

  async createCates({ cateCreateDTO, userId }) {
    const cate = this.catesRepository.create({
      name: cateCreateDTO.cateName,
      user: userId,
    });
    await this.catesRepository.insert(cate);
    return cate;
  }

  async updateTempNote({ cateId }) {
    const updateCate = await this.catesRepository.findOne({ id: cateId });
    updateCate.isTempNote = true;
    return await this.catesRepository.update(cateId, updateCate);
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
        select: ['id', 'name'],
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

  async getCateByCateId({ id, userId }) {
    return await this.catesRepository.findOne({
      select: ['id', 'name'],
      where: {
        id,
        user: userId,
      },
    });
  }

  //   async getAllSmallCatesByYear({ userId }) {
  //     const smallCates = await this.catesRepository.find({
  //       select: ['id', 'name'],
  //       where: {
  //         user: userId,
  //       },
  //     });

  //     const smallCatesByYear: { [key: number]: Cate[] } = {};
  //     for (const smallCate of smallCates) {
  //       const startedAtYear = smallCate.startedAt.getFullYear();
  //       const endedAtYear = smallCate.endedAt
  //         ? smallCate.endedAt.getFullYear()
  //         : new Date().getFullYear();

  //       const years = range(startedAtYear, endedAtYear);

  //       years.forEach((year) => {
  //         if (!smallCatesByYear[year]) {
  //           smallCatesByYear[year] = [];
  //         }
  //         smallCatesByYear[year].push(smallCate);
  //       });
  //     }

  //     return smallCatesByYear;
  //   }
}
