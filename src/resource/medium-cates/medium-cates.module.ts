import { mediumCatesProviders } from './medium-cates.providers';
import { MediumCatesService } from './medium-cates.service';
import { MediumCatesController } from './medium-cates.controller';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MediumCatesController],
  providers: [...mediumCatesProviders, MediumCatesService],
})
export class MediumCatesModule {}
