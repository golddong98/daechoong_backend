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
import { CatesService } from '../cates/cates.service';
import { TempNotesService } from '../temp-notes/temp-notes.service';
// import { MediumCatesService } from '../medium-cates/medium-cates.service';
// import { LargeCatesService } from '../large-cates/large-cates.service';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
    private readonly catesService: CatesService,
    private tempNotesService: TempNotesService,
  ) {}

  // @Get()
  // getNotes(): string {
  //   return this.notesService.getNotes();
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get('main/cate-id/:cateId')
  async getNotesTempNotesCateNameByCateId(
    @Req() req: Request,
    @Res() res: Response,
    @Param('cateId', ParseIntPipe) param: number,
  ) {
    const { confirmedCate } = await this.catesService.checkPermissionCate({
      userId: req.user.id,
      cateId: param,
    });

    const { notes, tempNote } =
      await this.notesService.getNotesTempNotesByCateId({
        cateId: param,
      });
    res.status(200).json({ notes, cate: confirmedCate, tempNote });
    return;
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('wrt/main')
  // async getAllNotesByCreatedAt(@Req() req: Request, @Res() res: Response) {
  //   const result = await this.notesService.getAllNotesByCreatedAt({
  //     userId: req.user.id,
  //   });
  //   res.status(200).json({ notes: result });
  //   return;
  // }

  @UseGuards(AuthGuard('jwt'))
  @Post('cate-id/:cateId')
  @UseInterceptors(FilesInterceptor('file', 10))
  async uploadNote(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createNoteBodyDTO: CreateNoteBodyDTO,
    @Param('cateId', ParseIntPipe) param: number,
    @UploadedFiles()
    files: Express.MulterS3.File[],
  ) {
    // 다 긁어 오는거 잘못 된듯
    const { confirmedCate } = await this.catesService.checkPermissionCate({
      userId: req.user.id,
      cateId: param,
    });

    const newNote = await this.notesService.createNote({
      content: createNoteBodyDTO.content,
      userId: req.user.id,
      cateId: param,
    });

    if (files && files.length > 0) {
      await this.filesService.uploadFiles({
        noteId: newNote.id,
        userId: req.user.id,
        files,
      });
    }

    // isTempNote state change (true=>false)
    if (confirmedCate.isTempNote) {
      //isTempNote 상태 변경
      await this.catesService.toggleIsTempNote({
        cateId: param,
      });
      //삭제까지
      const tempNote = await this.tempNotesService.getTempNoteByCateId({
        cateId: param,
      });
      await this.tempNotesService.deleteTempNote({ tempNoteId: tempNote.id });
    }

    res.status(200).send();
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('note-id/:noteId')
  async updateContentInNote(
    @Req() req: Request,
    @Res() res: Response,
    @Param('noteId', ParseIntPipe) param: number,
    @Body() updateNoteBodyDTO: CreateNoteBodyDTO,
  ) {
    await this.notesService.checkPermissionNotes({
      userId: req.user.id,
      noteId: param,
    });

    const result = await this.notesService.updateContentInNote({
      noteId: param,
      updateNoteBodyDTO,
    });
    res.status(200).json({ note: result });
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
    const { confirmedNote } = await this.notesService.checkPermissionNotes({
      userId: req.user.id,
      noteId: param,
    });

    const result = await this.filesService.uploadFiles({
      userId: req.user.id,
      noteId: confirmedNote.id,
      files,
    });
    res.status(200).json({ note: result });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('files/:fileId')
  async deleteFileInNote(
    @Req() req: Request,
    @Res() res: Response,
    @Param('fileId', ParseIntPipe) param: number,
  ) {
    await this.filesService.checkPermissionFile({
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
  @Delete('note-id/:noteId')
  async deleteNote(
    @Req() req: Request,
    @Res() res: Response,
    @Param('noteId', ParseIntPipe) param: number,
  ) {
    await this.notesService.checkPermissionNotes({
      userId: req.user.id,
      noteId: param,
    });

    await this.notesService.deleteNote({
      noteId: param,
    });

    res.status(200).send();
    return;
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('wrt/large-cate-id/:largeCateId')
  // async getNotesInLargeCateByCreatedAt(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Param('largeCateId', ParseIntPipe) param: number,
  // ) {
  //   await this.largeCatesService.checkPermissionLargeCate({
  //     userId: req.user.id,
  //     largeCateId: param,
  //   });

  //   const result = await this.notesService.getNotesInLargeCateByCreatedAt({
  //     largeCateId: param,
  //   });

  //   res.status(200).json({ notes: result });
  //   return;
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('mod/large-cate-id/:largeCateId')
  // async getNotesInLargeCateByUpdatedAt(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Param('largeCateId', ParseIntPipe) param: number,
  // ) {
  //   await this.largeCatesService.checkPermissionLargeCate({
  //     userId: req.user.id,
  //     largeCateId: param,
  //   });

  //   const result = await this.notesService.getNotesInLargeCateByUpdatedAt({
  //     largeCateId: param,
  //   });

  //   res.status(200).json({ notes: result });
  //   return;
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('wrt/medium-cate-id/:mediumCateId')
  // async getNotesInMediumCateByCreatedAt(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Param('mediumCateId', ParseIntPipe) param: number,
  // ) {
  //   await this.mediumCatesService.checkPermissionMediumCate({
  //     userId: req.user.id,
  //     mediumCateId: param,
  //   });

  //   const result = await this.notesService.getNotesInMediumCateByCreatedAt({
  //     mediumCateId: param,
  //   });

  //   res.status(200).json({ notes: result });
  //   return;
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('mod/medium-cate-id/:mediumCateId')
  // async getNotesInMediumCateByUpdatedAt(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Param('mediumCateId', ParseIntPipe) param: number,
  // ) {
  //   await this.mediumCatesService.checkPermissionMediumCate({
  //     userId: req.user.id,
  //     mediumCateId: param,
  //   });

  //   const result = await this.notesService.getNotesInMediumCateByUpdatedAt({
  //     mediumCateId: param,
  //   });

  //   res.status(200).json({ notes: result });
  //   return;
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get('cate-id/:cateId')
  async getNotesCateNameByCateId(
    @Req() req: Request,
    @Res() res: Response,
    @Param('cateId', ParseIntPipe) param: number,
  ) {
    const result = await this.notesService.getNotesCateNameByCateId({
      cateId: param,
      userId: req.user.id,
    });
    res.status(200).json({ notes: result });
    return;
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('mod/cate-id/:cateId')
  // async getNotesInCateByUpdatedAt(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Param('cateId', ParseIntPipe) param: number,
  // ) {
  //   await this.catesService.checkPermissionCate({
  //     userId: req.user.id,
  //     cateId: param,
  //   });

  //   const result = await this.notesService.getNotesInCateByUpdatedAt({
  //     cateId: param,
  //   });
  //   res.status(200).json({ notes: result });
  //   return;
  // }
}
