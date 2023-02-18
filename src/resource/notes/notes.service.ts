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
  async createNote({ content, user, smallCate }) {
    const note = this.notesRepository.create({
      content,
      user,
      smallCate,
    });
    return await this.notesRepository.insert(note);
  }
}
