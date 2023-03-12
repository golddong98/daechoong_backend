import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AfterSocialSignUpDTO } from '../auth/dtos/user-after-sign-up.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(): string {
    return this.usersService.getUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getUser(@Req() req: Request, @Res() res: Response) {
    const confirmedUser = await this.usersService.getUser({
      userId: req.user.id,
    });
    res.status(200).json({ user: confirmedUser });
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('me')
  async updateUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() afterSocialSignUpDTO: AfterSocialSignUpDTO,
  ) {
    await this.usersService.updateUser({
      userId: req.user.id,
      updateDTO: afterSocialSignUpDTO,
    });
    res.status(200).send();
    return;
  }
}
