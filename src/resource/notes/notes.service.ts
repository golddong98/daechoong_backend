import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from '../../database/entities/notes.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
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

  async getAllNotes({ userId }) {
    try {
      return await this.notesRepository
        .createQueryBuilder('note')
        .select([
          'note.id',
          'note.content',
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

      // await this.notesRepository.find({
      //   select: ['id', 'content', 'files'],
      //   relations: ['files'],
      //   where: { user: userId },
      //   order: {
      //     updatedAt: 'DESC',
      //   },
      // });
      // return confirmedNotes;
    } catch (error) {
      throw new BadRequestException('노트를 불러오는데 문제가 생겼습니다.');
    }
  }

  // createNoteDTO type만들기, return type만들기,
  async createNote({
    content,
    userId,
    smallCateId,
    mediumCateId,
    largeCateId,
  }) {
    const note = this.notesRepository.create({
      content,
      user: userId,
      smallCate: smallCateId,
      mediumCate: mediumCateId,
      largeCate: largeCateId,
    });
    await this.notesRepository.insert(note);
    return note;
  }

  async updateContentInNote({ noteId, updateNoteBodyDTO }) {
    const newContentInNote = this.notesRepository.create({
      content: updateNoteBodyDTO.content,
    });
    return await this.notesRepository.update(noteId, newContentInNote);
  }

  async deleteNote({ noteId }) {
    return await this.notesRepository.delete(noteId);
  }

  async getNotesInLargeCateByCreatedAt({ largeCateId }) {
    return await this.notesRepository
      .createQueryBuilder('note')
      .select([
        'note.id',
        'note.content',
        'file.id',
        'file.fileUrl',
        'file.originalName',
        'file.mimeType',
        'file.encoding',
        'file.size',
        'large_cate.id',
        'large_cate.name',
      ])
      .leftJoin('note.files', 'file')
      .leftJoin('note.largeCate', 'large_cate')
      .where(`note.largeCateId = ${largeCateId}`)
      .orderBy('note.createdAt', 'DESC')
      .getMany();
  }

  async getNotesInLargeCateByUpdatedAt({ largeCateId }) {
    return await this.notesRepository
      .createQueryBuilder('note')
      .select([
        'note.id',
        'note.content',
        'file.id',
        'file.fileUrl',
        'file.originalName',
        'file.mimeType',
        'file.encoding',
        'file.size',
        'large_cate.id',
        'large_cate.name',
      ])
      .leftJoin('note.files', 'file')
      .leftJoin('note.largeCate', 'large_cate')
      .where(`note.largeCateId = ${largeCateId}`)
      .orderBy('note.updatedAt', 'DESC')
      .getMany();
  }

  async getNotesInMediumCateByCreatedAt({ mediumCateId }) {
    return await this.notesRepository
      .createQueryBuilder('note')
      .select([
        'note.id',
        'note.content',
        'file.id',
        'file.fileUrl',
        'file.originalName',
        'file.mimeType',
        'file.encoding',
        'file.size',
        'medium_cate.id',
        'medium_cate.name',
      ])
      .leftJoin('note.files', 'file')
      .leftJoin('note.mediumCate', 'medium_cate')
      .where(`note.mediumCateId = ${mediumCateId}`)
      .orderBy('note.createdAt', 'DESC')
      .getMany();
  }

  async getNotesInMediumCateByUpdatedAt({ mediumCateId }) {
    return await this.notesRepository
      .createQueryBuilder('note')
      .select([
        'note.id',
        'note.content',
        'file.id',
        'file.fileUrl',
        'file.originalName',
        'file.mimeType',
        'file.encoding',
        'file.size',
        'medium_cate.id',
        'medium_cate.name',
      ])
      .leftJoin('note.files', 'file')
      .leftJoin('note.mediumCate', 'medium_cate')
      .where(`note.mediumCateId = ${mediumCateId}`)
      .orderBy('note.updatedAt', 'DESC')
      .getMany();
  }

  async getNotesInSmallCateByCreatedAt({ smallCateId }) {
    return await this.notesRepository
      .createQueryBuilder('note')
      .select([
        'note.id',
        'note.content',
        'file.id',
        'file.fileUrl',
        'file.originalName',
        'file.mimeType',
        'file.encoding',
        'file.size',
        'small_cate_id.id',
        'small_cate_id.name',
      ])
      .leftJoin('note.files', 'file')
      .leftJoin('note.smallCate', 'small_cate_id')
      .where(`note.smallCateId = ${smallCateId}`)
      .orderBy('note.createdAt', 'DESC')
      .getMany();
  }

  async getNotesInSmallCateByUpdatedAt({ smallCateId }) {
    return await this.notesRepository
      .createQueryBuilder('note')
      .select([
        'note.id',
        'note.content',
        'file.id',
        'file.fileUrl',
        'file.originalName',
        'file.mimeType',
        'file.encoding',
        'file.size',
        'small_cate_id.id',
        'small_cate_id.name',
      ])
      .leftJoin('note.files', 'file')
      .leftJoin('note.smallCate', 'small_cate_id')
      .where(`note.smallCateId = ${smallCateId}`)
      .orderBy('note.updatedAt', 'DESC')
      .getMany();
  }
}
