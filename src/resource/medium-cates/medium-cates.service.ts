import { Injectable, BadRequestException } from '@nestjs/common';
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

  async checkPermissionMediumCate({ userId, mediumCateId }) {
    try {
      const confirmedMediumCate = await this.mediumCatesRepository.findOne({
        relations: ['largeCate'],
        where: { id: mediumCateId, user: userId },
      });

      if (!confirmedMediumCate) {
        throw new Error();
      }
      return { confirmedMediumCate };
    } catch (error) {
      throw new BadRequestException('중분류를 변경할 권한이 없습니다.');
    }
  }

  async getMediumCateByLargeCateId({ param }) {
    return await this.mediumCatesRepository.find({
      where: {
        largeCate: param,
      },
    });
  }

  async createMediumCates({ param, mediumCateCreateDTO, userId }) {
    const mediumCate = this.mediumCatesRepository.create({
      name: mediumCateCreateDTO.mediumCateName,
      user: userId,
      largeCate: param,
    });
    await this.mediumCatesRepository.insert(mediumCate);
    return mediumCate;
  }

  async updateMediumCates({ param, mediumCateCreateDTO }) {
    const mediumCate = this.mediumCatesRepository.create({
      name: mediumCateCreateDTO.mediumCateName,
    });
    return await this.mediumCatesRepository.update(param, mediumCate);
  }

  async deleteMediumCates({ mediumCateId }) {
    return await this.mediumCatesRepository.delete(mediumCateId);
  }

  async getMediumCateById({ mediumCateId }) {
    try {
      const mediumCate = await this.mediumCatesRepository.findOne({
        id: mediumCateId,
      });
      if (!mediumCate) throw new Error();
      return mediumCate;
    } catch (error) {
      throw new BadRequestException('해당하는 대분류를 찾을 수 없습니다.');
    }
  }

  async getSmallCatesByMediumCateId({ id }) {
    const mediumCateByMediumCateId = await this.mediumCatesRepository.findOne({
      id,
    });
    const mediumCatesFromUser = await mediumCateByMediumCateId.smallCates;
    return mediumCatesFromUser;
  }
}
