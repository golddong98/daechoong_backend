import { Cate } from '../../database/entities/cates.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatesService } from './cates.service';
import { CatesController } from './cates.controller';
import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { NotesModule } from '../notes/notes.module';
// import { MediumCatesModule } from '../medium-cates/medium-cates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cate]),
    UsersModule,
    forwardRef(() => NotesModule),
  ],
  controllers: [CatesController],
  providers: [CatesService],
  exports: [CatesService],
})
export class CatesModule {}
