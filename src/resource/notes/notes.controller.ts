import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { CreateNoteBodyDTO } from './dtos/create-note-body-dto';
import { CreateNoteDTO } from './dtos/create-note.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getNotes(): string {
    return this.notesService.getNotes();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  postNote(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createNoteBodyDTO: CreateNoteBodyDTO,
  ): any {
    const createNoteDTO: CreateNoteDTO = {
      id: req.user.userId,
      body: createNoteBodyDTO,
    };
    this.notesService.createNote(createNoteDTO);
    res.status(200).send();
    return;
  }
}
