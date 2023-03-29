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
  Query,
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

  // @Get()
  // getSmallCatesTest(): string {
  //   return this.smallCatesService.getSmallCates();
  // }

  @UseGuards(AuthGuard('jwt'))
  @Post('medium-cate-id/:mediumCateId')
  async createSmallCate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('mediumCateId', ParseIntPipe) param: number,
    @Body() smallCateCreateDTO: SmallCateCreateDTO,
  ) {
    await this.mediumCatesService.checkPermissionMediumCate({
      userId: req.user.id,
      mediumCateId: param,
    });

    await this.smallCatesService.createSmallCates({
      mediumCateId: param,
      smallCateCreateDTO,
      userId: req.user.id,
    });
    res.status(200).send();
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('small-cate-id/:smallCateId')
  async updateSmallCate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('smallCateId', ParseIntPipe) param: number,
    @Body() smallCateNameUpdateDTO: SmallCateNameUpdateDTO,
  ) {
    await this.smallCatesService.checkPermissionSmallCate({
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
  @Delete('small-cate-id/:smallCateId')
  async deleteSmallCate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('smallCateId', ParseIntPipe) param: number,
  ) {
    await this.smallCatesService.checkPermissionSmallCate({
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
  @Get('medium-cate-id/:mediumCateId')
  async getSmallCatesByMediumCateId(
    @Req() req: Request,
    @Res() res: Response,
    @Param('mediumCateId', ParseIntPipe) param: number,
  ) {
    await this.mediumCatesService.checkPermissionMediumCate({
      userId: req.user.id,
      mediumCateId: param,
    });
    const result = await this.smallCatesService.getSmallCatesByMediumCateId({
      id: param,
    });
    res.status(200).json({ smallcates: result });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getSmallCatesByYearAndMonth(
    @Req() req: Request,
    @Res() res: Response,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const result = await this.smallCatesService.getSmallCatesByYearAndMonth({
      year,
      month,
      userId: req.user.id,
    });
    res.status(200).json({ smallcates: result });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('by-year')
  async getAllSmallCatesByYear(@Req() req: Request, @Res() res: Response) {
    const result = await this.smallCatesService.getAllSmallCatesByYear({
      userId: req.user.id,
    });
    res.status(200).json({ smallcates: result });
    return;
  }
}
