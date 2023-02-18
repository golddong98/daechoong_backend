import { Injectable } from '@nestjs/common';
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

  async createSmallCates({ mediumCateId, smallCateCreateDTO, user }) {
    const mediumCate = await this.mediumCatesService.getMediumCateById(
      mediumCateId,
    );
    const smallCate = this.smallCatesRepository.create({
      name: smallCateCreateDTO.smallCateName,
      startedAt: smallCateCreateDTO.startedAt,
      endedAt: smallCateCreateDTO.endedAt,
      user,
      mediumCate,
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
}
