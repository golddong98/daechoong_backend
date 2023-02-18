import { SmallCatesService } from './small-cates.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { SmallCateCreateDTO } from './dtos/small-cate-create.dto';
import { Request, Response } from 'express';
import { SmallCateNameUpdateDTO } from './dtos/small-cate-name-update.dto';
import { MediumCatesService } from '../medium-cates/medium-cates.service';

@Controller('small-cates')
export class SmallCatesController {
  constructor(
    private readonly smallCatesService: SmallCatesService,
    private readonly usersService: UsersService,
    private readonly mediumCatesService: MediumCatesService,
  ) {}

  @Get()
  getSmallCatesTest(): string {
    return this.smallCatesService.getSmallCates();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':mediumCateId')
  async createSmallCate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('mediumCateId', ParseIntPipe) param: number,
    @Body() smallCateCreateDTO: SmallCateCreateDTO,
  ) {
    const confirmedUser = await this.usersService.checkPermissionMediumCate({
      userId: req.user.id,
      mediumCateId: param,
    });

    await this.smallCatesService.createSmallCates({
      mediumCateId: param,
      smallCateCreateDTO,
      user: confirmedUser,
    });
    res.status(200).send();
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':smallCateId')
  async updateSmallCate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('smallCateId', ParseIntPipe) param: number,
    @Body() smallCateNameUpdateDTO: SmallCateNameUpdateDTO,
  ) {
    await this.usersService.checkPermissionSmallCate({
      userId: req.user.id,
      smallCateId: param,
    });

    await this.smallCatesService.updateSmallCates({
      smallCateId: param,
      smallCateNameUpdateDTO,
    });
    res.status(200).send();
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':smallCateId')
  async deleteSmallCate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('smallCateId', ParseIntPipe) param: number,
  ) {
    await this.usersService.checkPermissionSmallCate({
      userId: req.user.id,
      smallCateId: param,
    });

    await this.smallCatesService.deleteSmallCates({
      smallCateId: param,
    });

    res.status(200).send();
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':mediumCateId')
  async getSmallCatesByMediumCateId(
    @Req() req: Request,
    @Res() res: Response,
    @Param('mediumCateId', ParseIntPipe) param: number,
  ) {
    // 왜 async있는데 await를 쓰면 에러가 나지???
    await this.usersService.checkPermissionMediumCate({
      userId: req.user.id,
      mediumCateId: param,
    });
    // 왜 async있는데 await를 쓰면 에러가 나지???
    const result = await this.mediumCatesService.getSmallCatesByMediumCateId({
      id: param,
    });
    res.status(200).json({ smallcates: result });
    return;
  }
}
