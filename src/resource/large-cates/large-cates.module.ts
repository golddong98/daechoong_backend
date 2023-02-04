import { DatabaseModule } from '../../database/database.module';
import { LargeCatesController } from './large-cates.controller';
import { LargeCatesService } from './large-cates.service';
import { Module } from '@nestjs/common';
import { largeCatesProviders } from './large-cates.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [LargeCatesController],
  providers: [...largeCatesProviders, LargeCatesService],
})
export class LargeCatesModule {}
