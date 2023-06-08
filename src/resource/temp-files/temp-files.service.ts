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

  async uploadTempFiles({ userId, tempNoteId, files }) {
    try {
      for (const element of files) {
        const file = this.tempFilesRepository.create({
          originalName: element.originalname,
          encoding: element.encoding,
          mimeType: element.mimetype,
          size: element.size,
          fileUrl: element.location,
          user: userId,
          tempNote: tempNoteId,
        });

        await this.tempFilesRepository.insert(file);
      }
      return await this.tempNotesService.getOneNote({ tempNoteId });
    } catch (error) {
      return new BadRequestException('파일을 수정 중 오류가 났습니다.');
    }
  }

  // async updateUploadTempFiles({ tempNote, files, content }) {
  //   tempNote.content = content;
  //   return await this.tempFilesRepository.update(tempNote.id, tempNote);
  // }

  async deleteFileInNote({ fileId }) {
    return await this.tempFilesRepository.delete(fileId);
  }

  // async deleteNoteById(noteId: number): Promise<void> {
  //   const note = await this.tempNotesRepository.findOne(noteId);
  //   if (!note) {
  //     throw new NotFoundException('No note found.');
  //   }

  //   await this.deleteFilesByNoteId(note.id); // 해당 노트와 관련된 파일들을 삭제합니다.
  //   await this.tempNotesRepository.delete(noteId); // 노트를 삭제합니다.
  // }

  // async deleteFilesByNoteId(noteId: number): Promise<void> {
  //   const connection = getConnection();
  //   const queryRunner = connection.createQueryRunner();
  //   await queryRunner.startTransaction();

  //   try {
  //     await queryRunner.query(
  //       `
  //     DELETE FROM "file"
  //     WHERE "noteId" = $1
  //     `,
  //       [noteId],
  //     );
  //     await queryRunner.commitTransaction();
  //   } catch (err) {
  //     await queryRunner.rollbackTransaction();
  //     throw new InternalServerErrorException();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
}
