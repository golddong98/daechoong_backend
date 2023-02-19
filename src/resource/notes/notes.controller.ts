import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Express, Request, Response } from 'express';
import { CreateNoteBodyDTO } from './dtos/create-note-body-dto';
import { NotesService } from './notes.service';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { UsersService } from '../users/users.service';
import { SmallCatesService } from '../small-cates/small-cates.service';
import { FilesService } from '../files/files.service';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly usersService: UsersService,
    private readonly smallCatesService: SmallCatesService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  getNotes(): string {
    return this.notesService.getNotes();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':smallCateId')
  @UseInterceptors(FilesInterceptor('file', 10))
  async uploadNote(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createNoteBodyDTO: CreateNoteBodyDTO,
    @Param('smallCateId', ParseIntPipe) param: number,
    @UploadedFiles()
    files: Express.MulterS3.File[],
  ) {
    // 다 긁어 오는거 잘못 된듯
    const { confirmedUser, confirmedSmallCate } =
      await this.usersService.checkPermissionSmallCate({
        userId: req.user.id,
        smallCateId: param,
      });

    const newNote = await this.notesService.createNote({
      content: createNoteBodyDTO.content,
      user: confirmedUser,
      smallCate: confirmedSmallCate,
    });

    await this.filesService.uploadFiles({
      note: newNote.generatedMaps[0],
      user: confirmedUser,
      files,
    });

    res.status(200).send();
    return;
  }
  catch(error) {
    console.log(error);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('content/:noteId')
  async updateContentInNote(
    @Req() req: Request,
    @Res() res: Response,
    @Param('noteId', ParseIntPipe) param: number,
    @Body() updateNoteBodyDTO: CreateNoteBodyDTO,
  ) {
    await this.usersService.checkPermissionNotes({
      userId: req.user.id,
      noteId: param,
    });

    await this.notesService.updateContentInNote({
      noteId: param,
      updateNoteBodyDTO,
    });
    res.status(200).send();
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('files/:noteId')
  @UseInterceptors(FilesInterceptor('file', 10))
  async updateFilesInNote(
    @Req() req: Request,
    @Res() res: Response,
    @Param('noteId', ParseIntPipe) param: number,
    @UploadedFiles()
    files: Express.MulterS3.File[],
  ) {
    const { confirmedUser, confirmedNote } =
      await this.usersService.checkPermissionNotes({
        userId: req.user.id,
        noteId: param,
      });

    // const confirmedNote = await this.notesService.checkPermi;

    await this.filesService.updateFilesInNote({
      user: confirmedUser,
      note: confirmedNote,
      files,
    });
    res.status(200).send();
    return;
  }
}
