import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'src/database/entities/files.entity';
import { NotesService } from '../notes/notes.service';
// import iconv from 'iconv-lite';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private notesService: NotesService,
  ) {}

  async checkPermissionFile({ userId, fileId }) {
    try {
      const confirmedFile = await this.filesRepository.findOne({
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

  async uploadFiles({ userId, noteId, files }) {
    try {
      for (const element of files) {
        // const fileName = iconv.decode(element.originalname, 'euc-kr');
        const file = this.filesRepository.create({
          originalName: Buffer.from(element.originalname, 'latin1').toString(
            'utf8',
          ),
          // originalName: element.originalname,
          encoding: element.encoding,
          mimeType: element.mimetype,
          size: element.size,
          fileUrl: element.location,
          user: userId,
          note: noteId,
        });

        await this.filesRepository.insert(file);
      }
      return await this.notesService.getOneNote({ noteId });
    } catch (error) {
      return new BadRequestException('파일을 수정 중 오류가 났습니다.');
    }
  }

  // async updateUploadFiles({ tempNote, files }) {
  //   tempNote.content = content;
  //   return await this.filesRepository.update(tempNote.id, tempNote);
  // }

  async deleteFileInNote({ fileId }) {
    return await this.filesRepository.delete(fileId);
  }
}
