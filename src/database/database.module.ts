import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigService],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
