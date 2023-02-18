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

  async createSmallCates({ param, smallCateCreateDTO, user }) {
    const mediumCate = await this.mediumCatesService.getMediumCateById(param);
    const smallCate = this.smallCatesRepository.create({
      name: smallCateCreateDTO.smallCateName,
      startedAt: smallCateCreateDTO.startedAt,
      endedAt: smallCateCreateDTO.endedAt,
      user,
      mediumCate,
    });
    return await this.smallCatesRepository.insert(smallCate);
  }
}
