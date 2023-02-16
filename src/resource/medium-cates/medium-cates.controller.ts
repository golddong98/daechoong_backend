import { MediumCatesService } from './medium-cates.service';
import {
  Controller,
  Get,
  UseGuards,
  Post,
  Req,
  Res,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { MediumCateCreateDTO } from './dtos/medium-cate-create.dto';

@Controller('medium-cates')
export class MediumCatesController {
  constructor(private readonly mediumCatesService: MediumCatesService) {}

  @Get()
  getMediumCates(): string {
    return this.mediumCatesService.getMediumCates();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':largeCateId')
  async signUp(
    @Req() req: Request,
    @Res() res: Response,
    @Param('largeCateId', ParseIntPipe) param: number,
    @Body() mediumCateCreateDTO: MediumCateCreateDTO,
  ) {
    await this.mediumCatesService.createMediumCates({
      param,
      mediumCateCreateDTO: mediumCateCreateDTO,
      user: req.user,
    });
    res.status(200).send();
    return;
  }
}
