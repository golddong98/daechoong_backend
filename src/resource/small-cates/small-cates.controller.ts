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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { SmallCateCreateDTO } from './dtos/small-cate-create.dto';
import { Request, Response } from 'express';

@Controller('small-cates')
export class SmallCatesController {
  constructor(
    private readonly smallCatesService: SmallCatesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getSmallCates(): string {
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
      param,
      smallCateCreateDTO,
      user: confirmedUser,
    });
    res.status(200).send();
    return;
  }
}
