import { Injectable } from '@nestjs/common';

@Injectable()
export class NotesService {
  getNotes(): string {
    return 'Hello Notes!';
  }
}
