import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
