import { Injectable } from '@nestjs/common';
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

  // createNoteDTO type만들기, return type만들기,
  async createNote({ content, user, smallCate, mediumCate, largeCate }) {
    const note = this.notesRepository.create({
      content,
      user,
      smallCate,
      mediumCate,
      largeCate,
    });
    return await this.notesRepository.insert(note);
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
