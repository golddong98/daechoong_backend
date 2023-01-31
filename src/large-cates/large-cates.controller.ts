import { LargeCatesService } from './large-cates.service';
import { Controller, Get } from '@nestjs/common';

@Controller('large-cates')
export class LargeCatesController {
  constructor(private readonly largeCatesService: LargeCatesService) {}

  @Get()
  getLargeCates(): string {
    return this.largeCatesService.getLargeCates();
  }
}
