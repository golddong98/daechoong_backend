import { LargeCatesService } from './large-cates.service';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('large-cates')
export class LargeCatesController {
  constructor(private readonly largeCatesService: LargeCatesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  async getLargeCates(@Req() req: Request, @Res() res: Response) {
    const result = await this.largeCatesService.getLargeCates({
      userId: req.user.id,
    });
    res.status(200).json({ largeCates: result });
    return;
  }
}
