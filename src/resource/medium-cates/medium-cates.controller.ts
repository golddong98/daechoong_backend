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

@Controller('medium-cates')
export class MediumCatesController {
  constructor(
    private readonly mediumCatesService: MediumCatesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getMediumCates(): string {
    return this.mediumCatesService.getMediumCates();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':largeCateId')
  async createMediumCate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('largeCateId', ParseIntPipe) param: number,
    @Body() mediumCateCreateDTO: MediumCateCreateDTO,
  ) {
    const { confirmedUser } = await this.usersService.checkPermissionLargeCate({
      userId: req.user.id,
      largeCateId: param,
    });

    await this.mediumCatesService.createMediumCates({
      param,
      mediumCateCreateDTO,
      user: confirmedUser,
    });
    res.status(200).send();
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':mediumCateId')
  async updateMediumCate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('mediumCateId', ParseIntPipe) param: number,
    @Body() mediumCateCreateDTO: MediumCateCreateDTO,
  ) {
    await this.usersService.checkPermissionMediumCate({
      userId: req.user.id,
      mediumCateId: param,
    });

    await this.mediumCatesService.updateMediumCates({
      param,
      mediumCateCreateDTO,
    });
    res.status(200).send();
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':mediumCateId')
  async deleteMediumCate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('mediumCateId', ParseIntPipe) param: number,
  ) {
    await this.usersService.checkPermissionMediumCate({
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
