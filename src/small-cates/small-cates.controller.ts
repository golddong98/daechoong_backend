import { SmallCatesService } from './small-cates.service';
import { Controller, Get } from '@nestjs/common';

@Controller('small-cates')
export class SmallCatesController {
  constructor(private readonly smallCatesService: SmallCatesService) {}

  @Get()
  getSmallCates(): string {
    return this.smallCatesService.getSmallCates();
  }
}
