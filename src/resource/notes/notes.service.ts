import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from '../../database/entities/notes.entity';
import { CreateNoteDTO } from './dtos/create-note.dto';

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
  async createNote(createNoteDTO: CreateNoteDTO) {
    return this.notesRepository.save(createNoteDTO);
  }
}
