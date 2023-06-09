import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { range } from 'src/common/utils/functions';
import { Cate } from 'src/database/entities/cates.entity';
import { Repository } from 'typeorm';
import { NotesService } from '../notes/notes.service';
// import { MediumCatesService } from '../medium-cates/medium-cates.service';

@Injectable()
export class CatesService {
  constructor(
    @InjectRepository(Cate)
    private readonly catesRepository: Repository<Cate>,
    private readonly notesService: NotesService,
  ) {}

  getCates(): string {
    return 'Hello Cates!';
  }

  async checkPermissionCate({ userId, cateId }) {
    try {
      const confirmedCate = await this.catesRepository.findOne({
        // relations: ['mediumCate', 'largeCate'],
        select: ['id', 'name', 'isTempNote'],
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

  // async changeIsTempNote({ cateId }) {
  //   const updateCate = await this.catesRepository.findOne({ id: cateId });
  //   updateCate.isTempNote = true;
  //   return await this.catesRepository.update(cateId, updateCate);
  // }

  async toggleIsTempNote({ cateId }) {
    const updateCate = await this.catesRepository.findOne({ id: cateId });
    updateCate.isTempNote = !updateCate.isTempNote; // isTempNote 값을 반전시킵니다.
    return await this.catesRepository.update(cateId, updateCate);
  }

  async updateCate({ cateId, cateName }) {
    const newCate = this.catesRepository.create({
      name: cateName,
    });
    const updateResult = await this.catesRepository.update(cateId, newCate);
    if (updateResult.affected > 0) {
      return this.catesRepository.findOne({
        select: ['id', 'name'],
        where: { id: cateId },
      });
    } else {
      throw new NotFoundException(`소분류 수정 중 오류가 났습니다.`);
    }
  }

  async deleteCate({ cateId }) {
    return await this.catesRepository.delete(cateId);
  }

  async getCateById({ cateId }) {
    try {
      const cate = await this.catesRepository.findOne({ id: cateId });
      if (!cate) {
        throw new Error();
      }
      return cate;
    } catch (error) {
      throw new BadRequestException('임시노트가 존재하지 않습니다.');
    }
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

  async getAllCates({ userId }) {
    const cates = await this.catesRepository.find({
      select: ['id', 'name'],
      where: {
        user: userId,
      },
    });
    return cates;
  }

  // async getNotesByCatesLatestContent({ userId }) {
  //   const cates = await this.getAllCates({ userId });
  //   const catesWithLatestNote = await Promise.all(
  //     cates.map(async (cate) => {
  //       const latestNote = await this.notesService.getLatestNote({
  //         cateId: cate.id,
  //       });
  //       if (!latestNote) {
  //         return {
  //           cate: { id: cate.id, name: cate.name },
  //           note: {
  //             id: '',
  //             content: '',
  //             createdAt: '',
  //           },
  //         };
  //       }
  //       return {
  //         cate: { id: cate.id, name: cate.name },
  //         note: {
  //           id: latestNote.id,
  //           content: latestNote.content,
  //           createdAt: latestNote.createdAt,
  //         },
  //       };
  //     }),
  //   );
  //   return catesWithLatestNote;
  // }

  // async getNotesByCatesLatestContent({ userId }): Promise<any> {
  //   const cates = await this.catesRepository
  //     .find({ where: { user: userId, deletedAt: null } })
  //     .then((cates) =>
  //       Promise.all(
  //         cates.map(async (cate) => {
  //           const recentNotes = await this.notesService.getLatestNote({
  //             cateId: cate.id,
  //             userId,
  //           });
  //           if (!recentNotes.length) {
  //             return {
  //               cate: { id: cate.id, name: cate.name },
  //               note: {
  //                 id: '',
  //                 content: '',
  //                 createdAt: '',
  //               },
  //             };
  //           }
  //           return {
  //             cate: { id: cate.id, name: cate.name },
  //             note: {
  //               id: recentNotes[0].id,
  //               content: recentNotes[0].content,
  //               createdAt: recentNotes[0].createdAt,
  //             },
  //           };
  //         }),
  //       ),
  //     );
  //   return cates;
  // }

  // async getNotesByCatesLatestContent({ userId }): Promise<any> {
  //   const cates = await this.catesRepository
  //     .createQueryBuilder('cate')
  //     .select([
  //       'cate.id as id',
  //       'cate.name as name',
  //       'note.id as noteId',
  //       'note.content as content',
  //       'note.createdAt as createdAt',
  //     ])
  //     .leftJoin('cate.notes', 'note', 'note.deletedAt IS NULL')
  //     .where('cate.userId = :userId AND cate.deletedAt IS NULL', {
  //       userId,
  //     })
  //     .orderBy('note.createdAt', 'DESC')
  //     .getRawMany()
  //     .then((cates) =>
  //       cates.reduce((acc, cur) => {
  //         const cateIdx = acc.findIndex(({ id }) => id === cur.id);
  //         if (cateIdx !== -1) {
  //           const noteCreatedAt = new Date(cur.createdAt);
  //           const cateLastAtIndex =
  //             acc[cateIdx].note.createdAt == null
  //               ? null
  //               : new Date(acc[cateIdx].note.createdAt);
  //           // 현재 index의 note가 더 최신일 경우 update
  //           if (cateLastAtIndex == null || noteCreatedAt > cateLastAtIndex) {
  //             acc[cateIdx].note = {
  //               id: cur.noteId,
  //               content: cur.content,
  //               createdAt: cur.createdAt,
  //             };
  //           }
  //         } else {
  //           acc.push({
  //             cate: {
  //               id: cur.id,
  //               name: cur.name,
  //             },
  //             note: {
  //               id: cur.noteId,
  //               content: cur.content,
  //               createdAt: cur.createdAt,
  //             },
  //           });
  //         }
  //         return acc;
  //       }, []),
  //     );
  //   return cates;
  // }

  // async getNotesByCatesLatestContent({ userId }): Promise<any> {
  //   const cates = await this.catesRepository
  //     .createQueryBuilder('cate')
  //     .select([
  //       'cate.id as id',
  //       'cate.name as name',
  //       'MAX(note.createdAt) as latestCreatedAt',
  //       'GROUP_CONCAT(DISTINCT note.id ORDER BY note.createdAt DESC SEPARATOR ",") as noteIds',
  //     ])
  //     .leftJoin('cate.notes', 'note', 'note.deletedAt IS NULL')
  //     .where('cate.userId = :userId AND cate.deletedAt IS NULL', {
  //       userId,
  //     })
  //     .groupBy('cate.id')
  //     .getMany()
  //     .then((cates) =>
  //       cates.map(({ id, name, latestCreatedAt, noteIds }) => ({
  //         cate: { id, name },
  //         note:
  //           noteIds && noteIds.split(',')?.[0]
  //             ? { id: noteIds.split(',')[0], createdAt: latestCreatedAt }
  //             : null,
  //       })),
  //     );
  //   return cates;
  // }

  async getNotesByCatesLatestContent({ userId }): Promise<any> {
    const cates = await this.catesRepository
      .createQueryBuilder('cate')
      .select([
        'cate.id as id',
        'cate.name as name',
        'MAX(note.createdAt) as latestCreatedAt',
        'GROUP_CONCAT(DISTINCT note.id ORDER BY note.createdAt DESC SEPARATOR ",") as noteIds',
      ])
      .leftJoin('cate.notes', 'note', 'note.deletedAt IS NULL')
      .where('cate.userId = :userId AND cate.deletedAt IS NULL', {
        userId,
      })
      .groupBy('cate.id')
      .orderBy('latestCreatedAt', 'DESC')
      .getRawMany()
      .then((cates) =>
        cates.map(({ id, name, latestCreatedAt, noteIds }) => ({
          cate: { id, name },
          note:
            noteIds && noteIds.split(',')?.[0]
              ? { id: noteIds.split(',')[0], latestCreatedAt }
              : null,
        })),
      );
    return cates;
  }

  async getTopCatesByUserId({ userId }) {
    const subQuery = await this.notesService.getTopCatesByUserId({ userId });
    const cateIds = subQuery.map((result) => result.cateId);
    // return this.catesRepository
    //   .createQueryBuilder('cate')
    //   .where('id IN (:...cateIds)', { cateIds })
    //   .getMany();

    const cates = await this.catesRepository
      .createQueryBuilder('cate')
      .select(['cate.id as id', 'cate.name as name'])
      .addSelect('COUNT(note.id)', 'count')
      .leftJoin('cate.notes', 'note', 'note.deletedAt IS NULL')
      .where('cate.id IN (:...cateIds)', { cateIds })
      .groupBy('cate.id')
      .orderBy('count', 'DESC')
      .getRawMany();

    return cates;
  }

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
