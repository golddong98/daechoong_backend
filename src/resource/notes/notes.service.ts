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
      const confirmedNotes = await this.notesRepository.find({
        select: ['id', 'content', 'files'],
        relations: ['files'],
        where: { user: userId },
        order: {
          updatedAt: 'DESC',
        },
      });
      return confirmedNotes;
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
    const confirmedNotes = await this.notesRepository.find({
      relations: ['largeCate', 'files'],
      where: {
        largeCate: {
          id: largeCateId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return confirmedNotes;
  }

  async getNotesInLargeCateByUpdatedAt({ largeCateId }) {
    const confirmedNotes = await this.notesRepository.find({
      relations: ['largeCate', 'files'],
      where: {
        largeCate: {
          id: largeCateId,
        },
      },
      order: {
        updatedAt: 'DESC',
      },
    });
    return confirmedNotes;
  }

  async getNotesInMediumCateByCreatedAt({ mediumCateId }) {
    const confirmedNotes = await this.notesRepository.find({
      relations: ['mediumCate', 'files'],
      where: {
        mediumCate: {
          id: mediumCateId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return confirmedNotes;
  }

  async getNotesInMediumCateByUpdatedAt({ mediumCateId }) {
    const confirmedNotes = await this.notesRepository.find({
      relations: ['mediumCate', 'files'],
      where: {
        mediumCate: {
          id: mediumCateId,
        },
      },
      order: {
        updatedAt: 'DESC',
      },
    });
    return confirmedNotes;
  }

  async getNotesInSmallCateByCreatedAt({ smallCateId }) {
    const confirmedNotes = await this.notesRepository.find({
      relations: ['smallCate', 'files'],
      where: {
        smallCate: {
          id: smallCateId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return confirmedNotes;
  }

  async getNotesInSmallCateByUpdatedAt({ smallCateId }) {
    const confirmedNotes = await this.notesRepository.find({
      relations: ['smallCate', 'files'],
      where: {
        smallCate: {
          id: smallCateId,
        },
      },
      order: {
        updatedAt: 'DESC',
      },
    });
    return confirmedNotes;
  }
}
