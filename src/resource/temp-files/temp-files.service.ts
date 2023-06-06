import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TempFile } from 'src/database/entities/temp-files.entity';
import { TempNotesService } from '../temp-notes/temp-notes.service';

@Injectable()
export class TempFilesService {
  constructor(
    @InjectRepository(TempFile)
    private tempFilesRepository: Repository<TempFile>,
    private tempNotesService: TempNotesService,
  ) {}

  async checkPermissionFile({ userId, fileId }) {
    try {
      const confirmedFile = await this.tempFilesRepository.findOne({
        where: { id: fileId, user: userId },
      });

      if (!confirmedFile) {
        throw new Error();
      }
      return { confirmedFile };
    } catch (error) {
      throw new BadRequestException('파일을 변경할 권한이 없습니다.');
    }
  }

  //   async uploadFiles({ userId, noteId, files }) {
  //     try {
  //       for (const element of files) {
  //         const file = this.tempFilesRepository.create({
  //           originalName: element.originalname,
  //           encoding: element.encoding,
  //           mimeType: element.mimetype,
  //           size: element.size,
  //           fileUrl: element.location,
  //           user: userId,
  //           note: noteId,
  //         });

  //         await this.tempFilesRepository.insert(file);
  //       }
  //       return await this.tempNotesService.getOneNote({ noteId });
  //     } catch (error) {
  //       return new BadRequestException('파일을 수정 중 오류가 났습니다.');
  //     }
  //   }

  // async updateUploadFiles({ tempNote, files }) {
  //   tempNote.content = content;
  //   return await this.tempFilesRepository.update(tempNote.id, tempNote);
  // }

  async deleteFileInNote({ fileId }) {
    return await this.tempFilesRepository.delete(fileId);
  }
}
