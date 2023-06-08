import { CatesService } from './cates.service';
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
  //   Delete,
  //   Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { CateCreateDTO } from './dtos/cate-create.dto';
import { Request, Response } from 'express';
import { CateNameUpdateDTO } from './dtos/cate-name-update.dto';
// import { MediumCatesService } from '../medium-cates/medium-cates.service';

@Controller('cates')
export class CatesController {
  constructor(
    private readonly catesService: CatesService,
    private readonly usersService: UsersService, // private readonly mediumCatesService: MediumCatesService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  async getNotesByCatesLatestContent(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.catesService.getNotesByCatesLatestContent({
      userId: req.user.id,
    });
    res.status(200).json({ cates: result });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async createSmallCate(
    @Req() req: Request,
    @Res() res: Response,
    @Body() cateCreateDTO: CateCreateDTO,
  ) {
    const result = await this.catesService.createCates({
      cateCreateDTO,
      userId: req.user.id,
    });
    res.status(200).json({ cate: result });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('cate-id/:cateId')
  async updateSmallCate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('cateId', ParseIntPipe) param: number,
    @Body() cateNameUpdateDTO: CateNameUpdateDTO,
  ) {
    await this.catesService.checkPermissionCate({
      userId: req.user.id,
      cateId: param,
    });

    const result = await this.catesService.updateCate({
      cateId: param,
      cateName: cateNameUpdateDTO.cateName,
    });
    res.status(200).json({ cate: result });
    return;
  }

  //   @UseGuards(AuthGuard('jwt'))
  //   @Delete('small-cate-id/:smallCateId')
  //   async deleteSmallCate(
  //     @Req() req: Request,
  //     @Res() res: Response,
  //     @Param('smallCateId', ParseIntPipe) param: number,
  //   ) {
  //     await this.smallCatesService.checkPermissionSmallCate({
  //       userId: req.user.id,
  //       smallCateId: param,
  //     });

  //     await this.smallCatesService.deleteSmallCates({
  //       smallCateId: param,
  //     });

  //     res.status(200).send();
  //     return;
  //   }

  @UseGuards(AuthGuard('jwt'))
  @Get('cate-id/:cateId')
  async getCateByCateId(
    @Req() req: Request,
    @Res() res: Response,
    @Param('cateId', ParseIntPipe) param: number,
  ) {
    //   await this.mediumCatesService.checkPermissionMediumCate({
    //     userId: req.user.id,
    //     cateId: param,
    //   });
    const result = await this.catesService.getCateByCateId({
      id: param,
      userId: req.user.id,
    });
    res.status(200).json({ cate: result });
    return;
  }

  //   @UseGuards(AuthGuard('jwt'))
  //   @Get()
  //   async getSmallCatesByYearAndMonth(
  //     @Req() req: Request,
  //     @Res() res: Response,
  //     @Query('year') year: number,
  //     @Query('month') month: number,
  //   ) {
  //     const result = await this.smallCatesService.getSmallCatesByYearAndMonth({
  //       year,
  //       month,
  //       userId: req.user.id,
  //     });
  //     res.status(200).json({ smallCates: result });
  //     return;
  //   }

  //   @UseGuards(AuthGuard('jwt'))
  //   @Get('by-year')
  //   async getAllSmallCatesByYear(@Req() req: Request, @Res() res: Response) {
  //     const result = await this.smallCatesService.getAllSmallCatesByYear({
  //       userId: req.user.id,
  //     });
  //     res.status(200).json({ smallCates: result });
  //     return;
  //   }
}
