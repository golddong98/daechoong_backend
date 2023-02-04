import { DatabaseModule } from '../../database/database.module';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Module } from '@nestjs/common';
import { notesProviders } from './notes.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [NotesController],
  providers: [...notesProviders, NotesService],
})
export class NotesModule {}
