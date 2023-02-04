import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Note } from '../../database/entities/notes.entity';

@Injectable()
export class NotesService {
  constructor(
    @Inject('NOTE_REPOSITORY')
    private notesRepository: Repository<Note>,
  ) {}

  async findAll(): Promise<Note[]> {
    return this.notesRepository.find();
  }

  getNotes(): string {
    return 'Hello Notes!';
  }
}
