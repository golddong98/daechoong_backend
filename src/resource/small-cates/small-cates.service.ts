import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SmallCate } from 'src/database/entities/small-cates.entity';
import { Repository } from 'typeorm';
import { MediumCatesService } from '../medium-cates/medium-cates.service';

@Injectable()
export class SmallCatesService {
  constructor(
    @InjectRepository(SmallCate)
    private readonly smallCatesRepository: Repository<SmallCate>,
    private readonly mediumCatesService: MediumCatesService,
  ) {}

  getSmallCates(): string {
    return 'Hello smallCates!';
  }

  async checkPermissionSmallCate({ userId, smallCateId }) {
    try {
      const confirmedSmallCate = await this.smallCatesRepository.findOne({
        relations: ['mediumCate', 'largeCate'],
        where: {
          id: smallCateId,
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

  async createSmallCates({ mediumCateId, smallCateCreateDTO, userId }) {
    const smallCate = this.smallCatesRepository.create({
      name: smallCateCreateDTO.smallCateName,
      startedAt: smallCateCreateDTO.startedAt,
      endedAt: smallCateCreateDTO.endedAt,
      user: userId,
      mediumCate: mediumCateId,
    });
    return await this.smallCatesRepository.insert(smallCate);
  }

  async updateSmallCates({ smallCateId, smallCateNameUpdateDTO }) {
    const mediumCate = this.smallCatesRepository.create({
      name: smallCateNameUpdateDTO.smallCateName,
    });
    return await this.smallCatesRepository.update(smallCateId, mediumCate);
  }

  async deleteSmallCates({ smallCateId }) {
    return await this.smallCatesRepository.delete(smallCateId);
  }

  async getSmallCateById({ smallCateId }) {
    return await this.smallCatesRepository.findOne({ id: smallCateId });
  }

  async getSmallCatesByYearAndMonth({ year, month, userId }) {
    const fromDate = new Date(year, month - 1, 1);
    const toDate = new Date(year, month, 0);

    return await this.smallCatesRepository.find({
      where: `startedAt <= '${toDate.toISOString()}' AND endedAt >= '${fromDate.toISOString()}' AND userId = ${userId}`,
    });

    // const smallCates = await this.smallCatesRepository.find({
    //   relations: ['user'],
    // });

    // return smallCates.filter(
    //   (smallCate) =>
    //     smallCate.startedAt <= toDate &&
    //     smallCate.endedAt >= fromDate &&
    //     smallCate.user.id === userId,
    // );
  }

  async getSmallCatesByMediumCateId({ id: mediumCateId }) {
    return await this.smallCatesRepository.find({
      select: ['id', 'name'],
      where: {
        mediumCate: mediumCateId,
      },
    });
  }
}
