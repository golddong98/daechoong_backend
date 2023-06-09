import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from '../../database/entities/notes.entity';
import { TempNotesService } from '../temp-notes/temp-notes.service';
import moment from 'moment';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    private tempNotesService: TempNotesService,
  ) {}

  async findAll(): Promise<Note[]> {
    return this.notesRepository.find();
  }

  getNotes(): string {
    return 'Hello Notes!';
  }

  async checkPermissionNotes({ userId, noteId }) {
    try {
      const confirmedNote = await this.notesRepository.findOne({
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

  // async getNotesCatesTempNotesByCateId({ userId }) {
  //   try {
  //     return await this.notesRepository
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
  //       .orderBy('note.updatedAt', 'DESC')
  //       .getMany();
  //   } catch (error) {
  //     throw new BadRequestException('노트를 불러오는데 문제가 생겼습니다.');
  //   }
  // }

  async getNotesCateNameByCateId({ cateId, userId }) {
    try {
      return await this.notesRepository
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
          'cate.id',
          'cate.name',
          'cate.isTempNote',
        ])
        .leftJoin('note.files', 'file')
        .leftJoin('note.cate', 'cate')
        .where(`note.cateId = ${cateId}`)
        .andWhere(`note.userId = ${userId}`)
        .orderBy('note.createdAt', 'DESC')
        .getMany();
    } catch (error) {
      throw new BadRequestException('노트를 불러오는데 문제가 생겼습니다.');
    }
  }

  async getNotesByCateId({ cateId }) {
    try {
      return await this.notesRepository
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
        .where(`note.cateId = ${cateId}`)
        .orderBy('note.createdAt', 'DESC')
        .getMany();
    } catch (error) {
      throw new BadRequestException('노트를 불러오는데 문제가 생겼습니다.');
    }
  }

  async getNotesTempNotesByCateId({ cateId }) {
    try {
      const notes = await this.getNotesByCateId({
        cateId,
      });
      const tempNote = await this.tempNotesService.getTempNoteTempFilesByCateId(
        { cateId },
      );
      return { notes, tempNote };
    } catch (error) {
      throw new BadRequestException('노트를 불러오는데 문제가 생겼습니다.');
    }
  }

  // createNoteDTO type만들기, return type만들기,
  async createNote({
    content,
    userId,
    cateId,
    // mediumCateId,
    // largeCateId,
  }) {
    const note = this.notesRepository.create({
      content,
      user: userId,
      cate: cateId,
      // mediumCate: mediumCateId,
      // largeCate: largeCateId,
    });
    await this.notesRepository.insert(note);
    return note;
  }

  async getOneNote({ noteId }) {
    return await this.notesRepository
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
      .where(`note.id = ${noteId}`)
      .getOne();
  }

  async updateContentInNote({ noteId, updateNoteBodyDTO }) {
    const newContentInNote = this.notesRepository.create({
      content: updateNoteBodyDTO.content,
    });
    const updateResult = await this.notesRepository.update(
      noteId,
      newContentInNote,
    );
    if (updateResult.affected > 0) {
      return this.getOneNote({ noteId });
    } else {
      throw new NotFoundException(`노트 수정 중 오류가 났습니다.`);
    }
  }

  async deleteNote({ noteId }) {
    return await this.notesRepository.delete(noteId);
  }

  // async getLatestNote({ cateId }) {
  //   const latestNote = await this.notesRepository
  //     .createQueryBuilder('note')
  //     .select(['note.id', 'note.content', 'note.createdAt'])
  //     // .leftJoinAndSelect('note.cate', 'cate')
  //     .where('note.cateId = :cateId', { cateId })
  //     .orderBy('note.createdAt', 'DESC')
  //     .take(1)
  //     .getOne();
  //   return latestNote;
  // }

  async getLatestNote({ cateId, userId }): Promise<Note[]> {
    const notes = await this.notesRepository
      .createQueryBuilder('note')
      .select(['note.id', 'note.content', 'note.createdAt'])
      .leftJoin('note.cate', 'cate', 'cate.id = :cateId', {
        cateId,
      })
      .where(
        'cate.userId = :userId AND note.deletedAt IS NULL AND cate.deletedAt IS NULL',
        { userId },
      )
      .orderBy('note.createdAt', 'DESC')
      .limit(1)
      .getMany();

    return notes;
  }

  async getTopCatesByUserId({ userId }) {
    const limit = 3;
    const subQuery = await this.notesRepository
      .createQueryBuilder('note')
      .select('COUNT(*)', 'count')
      .addSelect('note.cateId', 'cateId')
      .where('note.userId = :userId AND note.deletedAt IS NULL', { userId })
      .groupBy('note.cateId')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();

    return subQuery;
  }

  async getCatesNoteCntByUserId({ userId }) {
    const subQuery = await this.notesRepository
      .createQueryBuilder('note')
      .select('COUNT(*)', 'count')
      .addSelect('note.cateId', 'cateId')
      .where('note.userId = :userId AND note.deletedAt IS NULL', { userId })
      .groupBy('note.cateId')
      .orderBy('count', 'DESC')
      .getRawMany();

    return subQuery;
  }

  async getNoteDates({ year, month, userId }): Promise<boolean[]> {
    const startOfMonth = moment([year, month - 1]).startOf('month');
    const endOfMonth = moment([year, month - 1]).endOf('month');

    const notes = await this.notesRepository
      .createQueryBuilder('note')
      .select(['note.id as id', 'DATE(note.createdAt) as createdAt'])
      .where(
        'note.createdAt BETWEEN :startOfMonth AND :endOfMonth AND note.deletedAt IS NULL',
        {
          startOfMonth: startOfMonth.format('YYYY-MM-DD'),
          endOfMonth: endOfMonth.format('YYYY-MM-DD'),
        },
      )
      .andWhere('note.userId = :userId AND note.deletedAt IS NULL', { userId })
      .getRawMany();

    const dates = Array(endOfMonth.date()).fill(false);
    notes.forEach(({ createdAt }) => {
      const date = moment(createdAt).date();
      dates[date - 1] = true;
    });

    return dates;
  }

  // async getCategoryByNoteDate({ year, month, day, userId }) {
  //   const note = await this.notesRepository
  //     .createQueryBuilder('note')
  //     .leftJoinAndSelect('note.cate', 'cate')
  //     .where(
  //       'YEAR(note.createdAt) = :year AND MONTH(note.createdAt) = :month AND DAY(note.createdAt) = :day',
  //       {
  //         year: year,
  //         month: month,
  //         day: day,
  //       },
  //     )
  //     .andWhere('note.userId = :userId AND note.deletedAt IS NULL', { userId })
  //     .getOne();

  //   if (!note) {
  //     // 노트가 없는 경우 null을 리턴합니다.
  //     return null;
  //   }

  //   const { id, name } = note.cate;
  //   return { id, name };
  // }

  async getCategoryByNoteDate({ year, month, day, userId }) {
    const notes = await this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.cate', 'cate')
      .where(
        'YEAR(note.createdAt) = :year AND MONTH(note.createdAt) = :month AND DAY(note.createdAt) = :day',
        {
          year: year,
          month: month,
          day: day,
        },
      )
      .andWhere('note.userId = :userId AND note.deletedAt IS NULL', { userId })
      .getMany();

    if (!notes || notes.length === 0) {
      // 노트가 없는 경우 빈 배열을 리턴합니다.
      return [];
    }

    // 노트에서 카테고리 정보를 추출합니다.
    const categories = notes.map((note) => {
      const { id, name } = note.cate;
      return { id, name };
    });

    // 중복된 카테고리를 제거합니다.
    const uniqueCategories = categories.reduce((acc, category) => {
      return acc.find((c) => c.id === category.id) ? acc : [...acc, category];
    }, []);

    return uniqueCategories;
  }

  // async getNotesInLargeCateByCreatedAt({ largeCateId }) {
  //   return await this.notesRepository
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
  //   return await this.notesRepository
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
  //   return await this.notesRepository
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
  //   return await this.notesRepository
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
  //   return await this.notesRepository
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
