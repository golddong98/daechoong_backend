import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TempNote } from '../../database/entities/temp-notes.entity';

@Injectable()
export class TempNotesService {
  constructor(
    @InjectRepository(TempNote)
    private tempNotesRepository: Repository<TempNote>,
  ) {}

  async findAll(): Promise<TempNote[]> {
    return this.tempNotesRepository.find();
  }

  getNotes(): string {
    return 'Hello Notes!';
  }

  getTempNoteByCateId({ cateId }) {
    return this.tempNotesRepository.findOne({ cate: cateId });
  }

  async checkPermissionNotes({ userId, noteId }) {
    try {
      const confirmedNote = await this.tempNotesRepository.findOne({
        relations: ['files'],
        where: { id: noteId, user: userId },
      });

      if (!confirmedNote) {
        throw new Error();
      }
      return { confirmedNote };
    } catch (error) {
      throw new BadRequestException('노트의 글을 변경할 권한이 없습니다.');
    }
  }

  async getNotesCatesTempNotesByCateId({ userId }) {
    try {
      return await this.tempNotesRepository
        .createQueryBuilder('note')
        .select([
          'note.id',
          'note.content',
          'note.createdAt',
          'file.id',
          'file.fileUrl',
          'file.originalName',
          'file.mimeType',
          'file.encoding',
          'file.size',
        ])
        .leftJoin('note.files', 'file')
        .where(`note.userId = ${userId}`)
        .orderBy('note.updatedAt', 'DESC')
        .getMany();
    } catch (error) {
      throw new BadRequestException('노트를 불러오는데 문제가 생겼습니다.');
    }
  }

  async getNotesCateNameByCateId({ cateId, userId }) {
    try {
      return await this.tempNotesRepository
        .createQueryBuilder('temp_note')
        .select([
          'temp_note.id',
          'temp_note.content',
          'temp_note.createdAt',
          'file.id',
          'file.fileUrl',
          'file.originalName',
          'file.mimeType',
          'file.encoding',
          'file.size',
          // 'cate_id.id',
          // 'cate_id.name',
        ])
        .leftJoin('temp_note.files', 'file')
        // .leftJoin('temp_note.cate', 'cate_id')
        .where(`temp_note.cateId = ${cateId}`)
        .andWhere(`temp_note.userId = ${userId}`)
        .orderBy('temp_note.createdAt', 'DESC')
        .getOne();
    } catch (error) {
      throw new BadRequestException('노트를 불러오는데 문제가 생겼습니다.');
    }
  }

  // async getAllNotesByCreatedAt({ userId }) {
  //   try {
  //     return await this.tempNotesRepository
  //       .createQueryBuilder('note')
  //       .select([
  //         'note.id',
  //         'note.content',
  //         'note.createdAt',
  //         'file.id',
  //         'file.fileUrl',
  //         'file.originalName',
  //         'file.mimeType',
  //         'file.encoding',
  //         'file.size',
  //       ])
  //       .leftJoin('note.files', 'file')
  //       .where(`note.userId = ${userId}`)
  //       .orderBy('note.createdAt', 'DESC')
  //       .getMany();
  //   } catch (error) {
  //     throw new BadRequestException('노트를 불러오는데 문제가 생겼습니다.');
  //   }
  // }

  async isTempNote({ cateId }) {
    try {
      const tempNote = await this.tempNotesRepository.findOne({ id: cateId });
      if (!tempNote) {
        throw new Error();
      }
      return tempNote;
    } catch (error) {
      throw new BadRequestException('임시노트가 존재하지 않습니다.');
    }
  }

  // createNoteDTO type만들기, return type만들기,
  async createNote({ content, userId, cateId }) {
    const tempNote = this.tempNotesRepository.create({
      content,
      user: userId,
      cate: cateId,
      // mediumCate: mediumCateId,
      // largeCate: largeCateId,
    });
    await this.tempNotesRepository.insert(tempNote);
    // const updateCate = await this.catesRepository.findOne({ id: cateId });
    // updateCate.isTempNote = true;
    // return await this.catesRepository.update(cateId, updateCate);
    return tempNote;
    // tempNote.content = content;
    // return await this.tempNotesRepository.update(tempNote.id, tempNote);
  }

  async updateTempNote({ tempNote, content }) {
    tempNote.content = content;
    return await this.tempNotesRepository.update(tempNote.id, tempNote);
  }

  async getOneNote({ tempNoteId }) {
    return await this.tempNotesRepository
      .createQueryBuilder('note')
      .select([
        'note.id',
        'note.content',
        'note.createdAt',
        'file.id',
        'file.fileUrl',
        'file.originalName',
        'file.mimeType',
        'file.encoding',
        'file.size',
      ])
      .leftJoin('note.files', 'file')
      .where(`note.id = ${tempNoteId}`)
      .getOne();
  }

  async updateContentInNote({ tempNoteId, updateNoteBodyDTO }) {
    const newContentInNote = this.tempNotesRepository.create({
      content: updateNoteBodyDTO.content,
    });
    const updateResult = await this.tempNotesRepository.update(
      tempNoteId,
      newContentInNote,
    );
    if (updateResult.affected > 0) {
      return this.getOneNote({ tempNoteId });
    } else {
      throw new NotFoundException(`노트 수정 중 오류가 났습니다.`);
    }
  }

  async deleteTempNote({ tempNoteId }) {
    return await this.tempNotesRepository.delete(tempNoteId);
  }

  // async getNotesInLargeCateByCreatedAt({ largeCateId }) {
  //   return await this.tempNotesRepository
  //     .createQueryBuilder('note')
  //     .select([
  //       'note.id',
  //       'note.content',
  //       'note.createdAt',
  //       'file.id',
  //       'file.fileUrl',
  //       'file.originalName',
  //       'file.mimeType',
  //       'file.encoding',
  //       'file.size',
  //       'large_cate.id',
  //       'large_cate.name',
  //     ])
  //     .leftJoin('note.files', 'file')
  //     .leftJoin('note.largeCate', 'large_cate')
  //     .where(`note.largeCateId = ${largeCateId}`)
  //     .orderBy('note.createdAt', 'DESC')
  //     .getMany();
  // }

  // async getNotesInLargeCateByUpdatedAt({ largeCateId }) {
  //   return await this.tempNotesRepository
  //     .createQueryBuilder('note')
  //     .select([
  //       'note.id',
  //       'note.content',
  //       'note.createdAt',
  //       'file.id',
  //       'file.fileUrl',
  //       'file.originalName',
  //       'file.mimeType',
  //       'file.encoding',
  //       'file.size',
  //       'large_cate.id',
  //       'large_cate.name',
  //     ])
  //     .leftJoin('note.files', 'file')
  //     .leftJoin('note.largeCate', 'large_cate')
  //     .where(`note.largeCateId = ${largeCateId}`)
  //     .orderBy('note.updatedAt', 'DESC')
  //     .getMany();
  // }

  // async getNotesInMediumCateByCreatedAt({ mediumCateId }) {
  //   return await this.tempNotesRepository
  //     .createQueryBuilder('note')
  //     .select([
  //       'note.id',
  //       'note.content',
  //       'note.createdAt',
  //       'file.id',
  //       'file.fileUrl',
  //       'file.originalName',
  //       'file.mimeType',
  //       'file.encoding',
  //       'file.size',
  //       'medium_cate.id',
  //       'medium_cate.name',
  //     ])
  //     .leftJoin('note.files', 'file')
  //     .leftJoin('note.mediumCate', 'medium_cate')
  //     .where(`note.mediumCateId = ${mediumCateId}`)
  //     .orderBy('note.createdAt', 'DESC')
  //     .getMany();
  // }

  // async getNotesInMediumCateByUpdatedAt({ mediumCateId }) {
  //   return await this.tempNotesRepository
  //     .createQueryBuilder('note')
  //     .select([
  //       'note.id',
  //       'note.content',
  //       'note.createdAt',
  //       'file.id',
  //       'file.fileUrl',
  //       'file.originalName',
  //       'file.mimeType',
  //       'file.encoding',
  //       'file.size',
  //       'medium_cate.id',
  //       'medium_cate.name',
  //     ])
  //     .leftJoin('note.files', 'file')
  //     .leftJoin('note.mediumCate', 'medium_cate')
  //     .where(`note.mediumCateId = ${mediumCateId}`)
  //     .orderBy('note.updatedAt', 'DESC')
  //     .getMany();
  // }

  // async getNotesInSmallCateByUpdatedAt({ cateId }) {
  //   return await this.tempNotesRepository
  //     .createQueryBuilder('note')
  //     .select([
  //       'note.id',
  //       'note.content',
  //       'note.createdAt',
  //       'file.id',
  //       'file.fileUrl',
  //       'file.originalName',
  //       'file.mimeType',
  //       'file.encoding',
  //       'file.size',
  //       'small_cate_id.id',
  //       'small_cate_id.name',
  //     ])
  //     .leftJoin('note.files', 'file')
  //     .leftJoin('note.smallCate', 'small_cate_id')
  //     .where(`note.smallCateId = ${cateId}`)
  //     .orderBy('note.updatedAt', 'DESC')
  //     .getMany();
  // }
}
