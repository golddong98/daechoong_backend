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
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { MediumCateCreateDTO } from './dtos/medium-cate-create.dto';
import { UsersService } from '../users/users.service';
import { LargeCatesService } from '../large-cates/large-cates.service';

@Controller('medium-cates')
export class MediumCatesController {
  constructor(
    private readonly mediumCatesService: MediumCatesService,
    private readonly usersService: UsersService,
    private readonly largeCatesService: LargeCatesService,
  ) {}

  // @Get()
  // getMediumCates(): string {
  //   return this.mediumCatesService.getMediumCates();
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get('large-cate-id/:largeCateId')
  async getMediumCateByLargeCateId(
    @Req() req: Request,
    @Res() res: Response,
    @Param('largeCateId', ParseIntPipe) param: number,
    // @Body() mediumCateCreateDTO: MediumCateCreateDTO,
  ) {
    await this.largeCatesService.checkPermissionLargeCate({
      userId: req.user.id,
      largeCateId: param,
    });

    const result = await this.mediumCatesService.getMediumCateByLargeCateId({
      param,
    });
    res.status(200).json({ mediumCates: result });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('large-cate-id/:largeCateId')
  async createMediumCate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('largeCateId', ParseIntPipe) param: number,
    @Body() mediumCateCreateDTO: MediumCateCreateDTO,
  ) {
    await this.largeCatesService.checkPermissionLargeCate({
      userId: req.user.id,
      largeCateId: param,
    });

    const result = await this.mediumCatesService.createMediumCates({
      param,
      mediumCateCreateDTO,
      userId: req.user.id,
    });
    res.status(200).json({ mediumCate: result });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('medium-cate-id/:mediumCateId')
  async updateMediumCate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('mediumCateId', ParseIntPipe) param: number,
    @Body() mediumCateCreateDTO: MediumCateCreateDTO,
  ) {
    await this.mediumCatesService.checkPermissionMediumCate({
      userId: req.user.id,
      mediumCateId: param,
    });

    const result = await this.mediumCatesService.updateMediumCates({
      param,
      mediumCateCreateDTO,
    });
    res.status(200).json({ mediumCate: result });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('medium-cate-id/:mediumCateId')
  async deleteMediumCate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('mediumCateId', ParseIntPipe) param: number,
  ) {
    await this.mediumCatesService.checkPermissionMediumCate({
      userId: req.user.id,
      mediumCateId: param,
    });

    await this.mediumCatesService.deleteMediumCates({
      mediumCateId: param,
    });

    res.status(200).send();
    return;
  }
}
