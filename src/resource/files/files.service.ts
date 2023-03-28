import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'src/database/entities/files.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {}

  async uploadFiles({ userId, noteId, files }) {
    for (const element of files) {
      const file = this.filesRepository.create({
        originalName: element.originalname,
        encoding: element.encoding,
        mimeType: element.mimetype,
        size: element.size,
        fileUrl: element.location,
        user: userId,
        note: noteId,
      });

      await this.filesRepository.insert(file);
    }
    return;
  }

  async deleteFileInNote({ fileId }) {
    return await this.filesRepository.delete(fileId);
  }
}
