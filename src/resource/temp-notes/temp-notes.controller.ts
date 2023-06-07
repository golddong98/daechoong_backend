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
  //   Put,
  //   Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Express, Request, Response } from 'express';
import { TempNotesService } from './temp-notes.service';
import { CreateTempNoteBodyDTO } from './dtos/create-temp-note-body.dto';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { UsersService } from '../users/users.service';
import { TempFilesService } from '../temp-files/temp-files.service';
import { CatesService } from '../cates/cates.service';
// import { MediumCatesService } from '../medium-cates/medium-cates.service';
// import { LargeCatesService } from '../large-cates/large-cates.service';

@Controller('temp-note')
export class TempNotesController {
  constructor(
    private readonly tempNotesService: TempNotesService,
    private readonly usersService: UsersService,
    private readonly tempFilesService: TempFilesService,
    private readonly catesService: CatesService,
  ) {}

  @Get()
  getNotes(): string {
    return this.tempNotesService.getNotes();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('main/cate-id/:cate-id')
  async getNotesCatesTempNotesByCateId(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.tempNotesService.getNotesCatesTempNotesByCateId({
      userId: req.user.id,
    });
    res.status(200).json({ notes: result });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('cate-id/:cateId')
  @UseInterceptors(FilesInterceptor('file', 10))
  async uploadTempNote(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createTempNoteBodyDTO: CreateTempNoteBodyDTO,
    @Param('cateId', ParseIntPipe) param: number,
    @UploadedFiles()
    files: Express.MulterS3.File[],
  ) {
    const cate = await this.catesService.getCateById({
      cateId: param,
    });
    // console.log(tempNote);

    // cate.isTempNote == true이면 즉, 임시노트가 이미 존재하면 기존 temp-note 삭제
    if (cate.isTempNote) {
      const tempNote = await this.tempNotesService.getTempNoteByCateId({
        cateId: param,
      });
      await this.tempNotesService.deleteTempNote({ tempNoteId: tempNote.id });
    }
    // 해당 임시 노트를 삭제

    // content 추가
    const newTempNote = await this.tempNotesService.createNote({
      content: createTempNoteBodyDTO.content,
      userId: req.user.id,
      cateId: param,
    });

    // 파일 추가
    if (files && files.length > 0) {
      await this.tempFilesService.uploadTempFiles({
        tempNoteId: newTempNote.id,
        userId: req.user.id,
        files,
      });
    }
    // isTempNote state change (false=>true)
    if (!cate.isTempNote) {
      await this.catesService.toggleIsTempNote({
        cateId: param,
      });
    }

    res.status(200).send();
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('cate-id/:cateId')
  async getTempNotesCateNameByCateId(
    @Req() req: Request,
    @Res() res: Response,
    @Param('cateId', ParseIntPipe) param: number,
  ) {
    const result = await this.tempNotesService.getNotesCateNameByCateId({
      cateId: param,
      userId: req.user.id,
    });
    res.status(200).json({ tempNote: result });
    return;
  }
}
