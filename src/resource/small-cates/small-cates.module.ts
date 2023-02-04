import { smallCatesProviders } from './small-cates.providers';
import { DatabaseModule } from '../../database/database.module';
import { SmallCatesService } from './small-cates.service';
import { SmallCatesController } from './small-cates.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [SmallCatesController],
  providers: [...smallCatesProviders, SmallCatesService],
})
export class SmallCatesModule {}
