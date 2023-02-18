import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediumCate } from 'src/database/entities/medium-cates.entity';
import { Repository } from 'typeorm';
import { LargeCatesService } from '../large-cates/large-cates.service';

@Injectable()
export class MediumCatesService {
  constructor(
    @InjectRepository(MediumCate)
    private readonly mediumCatesRepository: Repository<MediumCate>,
    private readonly largeCatesService: LargeCatesService,
  ) {}

  getMediumCates(): string {
    return 'Hello mediumCates!';
  }

  async createMediumCates({ param, mediumCateCreateDTO, user }) {
    const largeCate = await this.largeCatesService.getLargeCateById(param);
    const mediumCate = this.mediumCatesRepository.create({
      name: mediumCateCreateDTO.mediumCateName,
      user,
      largeCate,
    });
    return await this.mediumCatesRepository.insert(mediumCate);
  }

  async updateMediumCates({ param, mediumCateCreateDTO }) {
    const mediumCate = this.mediumCatesRepository.create({
      name: mediumCateCreateDTO.mediumCateName,
    });
    return await this.mediumCatesRepository.update(param, mediumCate);
  }
}
