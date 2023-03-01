import { UsersService } from './users.service';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

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
}
