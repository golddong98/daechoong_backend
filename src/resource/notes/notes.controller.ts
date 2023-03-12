import { LargeCatesService } from './../large-cates/large-cates.service';
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
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Express, Request, Response } from 'express';
import { CreateNoteBodyDTO } from './dtos/create-note-body-dto';
import { NotesService } from './notes.service';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { UsersService } from '../users/users.service';
import { FilesService } from '../files/files.service';
import { SmallCatesService } from '../small-cates/small-cates.service';
import { MediumCatesService } from '../medium-cates/medium-cates.service';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
    private readonly smallCatesService: SmallCatesService,
    private readonly mediumCatesService: MediumCatesService,
    private readonly largeCatesService: LargeCatesService,
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

    const confirmedMediumCate = await this.smallCatesService.getSmallCateById({
      smallCateId: confirmedSmallCate.id,
    });

    const confirmedLargeCate = await this.mediumCatesService.getMediumCateById({
      mediumCateId: confirmedMediumCate.id,
    });

    const newNote = await this.notesService.createNote({
      content: createNoteBodyDTO.content,
      user: confirmedUser,
      smallCate: confirmedSmallCate,
      mediumCate: confirmedMediumCate,
      largeCate: confirmedLargeCate,
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

    await this.filesService.uploadFiles({
      user: confirmedUser,
      note: confirmedNote,
      files,
    });
    res.status(200).send();
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('files/:fileId')
  async deleteFileInNote(
    @Req() req: Request,
    @Res() res: Response,
    @Param('fileId', ParseIntPipe) param: number,
  ) {
    await this.usersService.checkPermissionFile({
      userId: req.user.id,
      fileId: param,
    });

    await this.filesService.deleteFileInNote({
      fileId: param,
    });

    res.status(200).send();
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':noteId')
  async deleteNote(
    @Req() req: Request,
    @Res() res: Response,
    @Param('noteId', ParseIntPipe) param: number,
  ) {
    await this.usersService.checkPermissionNotes({
      userId: req.user.id,
      noteId: param,
    });

    await this.notesService.deleteNote({
      noteId: param,
    });

    res.status(200).send();
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('wrt/large-cate/:largeCateId')
  async getNotesInLargeCateByCreatedAt(
    @Req() req: Request,
    @Res() res: Response,
    @Param('largeCateId', ParseIntPipe) param: number,
  ) {
    await this.usersService.checkPermissionLargeCate({
      userId: req.user.id,
      largeCateId: param,
    });

    const result = await this.notesService.getNotesInLargeCateByCreatedAt({
      largeCateId: param,
    });

    res.status(200).json({ notes: result });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mod/large-cate/:largeCateId')
  async getNotesInLargeCateByUpdatedAt(
    @Req() req: Request,
    @Res() res: Response,
    @Param('largeCateId', ParseIntPipe) param: number,
  ) {
    await this.usersService.checkPermissionLargeCate({
      userId: req.user.id,
      largeCateId: param,
    });

    const result = await this.notesService.getNotesInLargeCateByUpdatedAt({
      largeCateId: param,
    });

    res.status(200).json({ notes: result });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('wrt/medium-cate/:mediumCateId')
  async getNotesInMediumCateByCreatedAt(
    @Req() req: Request,
    @Res() res: Response,
    @Param('mediumCateId', ParseIntPipe) param: number,
  ) {
    await this.usersService.checkPermissionMediumCate({
      userId: req.user.id,
      mediumCateId: param,
    });

    const result = await this.notesService.getNotesInMediumCateByCreatedAt({
      mediumCateId: param,
    });

    res.status(200).json({ notes: result });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mod/medium-cate/:mediumCateId')
  async getNotesInMediumCateByUpdatedAt(
    @Req() req: Request,
    @Res() res: Response,
    @Param('mediumCateId', ParseIntPipe) param: number,
  ) {
    await this.usersService.checkPermissionMediumCate({
      userId: req.user.id,
      mediumCateId: param,
    });

    const result = await this.notesService.getNotesInMediumCateByUpdatedAt({
      mediumCateId: param,
    });

    res.status(200).json({ notes: result });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('wrt/small-cate/:smallCateId')
  async getNotesInSmallCateByCreatedAt(
    @Req() req: Request,
    @Res() res: Response,
    @Param('smallCateId', ParseIntPipe) param: number,
  ) {
    await this.usersService.checkPermissionSmallCate({
      userId: req.user.id,
      smallCateId: param,
    });

    const result = await this.notesService.getNotesInSmallCateByCreatedAt({
      smallCateId: param,
    });
    res.status(200).json({ notes: result });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mod/small-cate/:smallCateId')
  async getNotesInSmallCateByUpdatedAt(
    @Req() req: Request,
    @Res() res: Response,
    @Param('smallCateId', ParseIntPipe) param: number,
  ) {
    await this.usersService.checkPermissionSmallCate({
      userId: req.user.id,
      smallCateId: param,
    });

    const result = await this.notesService.getNotesInSmallCateByUpdatedAt({
      smallCateId: param,
    });
    res.status(200).json({ notes: result });
    return;
  }
}
