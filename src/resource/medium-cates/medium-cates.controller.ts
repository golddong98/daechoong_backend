import { MediumCatesService } from './medium-cates.service';
import { Controller, Get } from '@nestjs/common';

@Controller('medium-cates')
export class MediumCatesController {
  constructor(private readonly mediumCatesService: MediumCatesService) {}

  @Get()
  getMediumCates(): string {
    return this.mediumCatesService.getMediumCates();
  }
}
