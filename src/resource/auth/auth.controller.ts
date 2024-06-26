import {
  Controller,
  Get,
  Res,
  Req,
  UseGuards,
  // Post,
  // Body,
  // UsePipes,
  // ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
// import { AfterSocialSignUpDTO } from './dtos/user-after-sign-up.dto';
// import { AfterSocialSignUpDTO } from './dtos/user-after-sign-up.dto';

interface IOAuthUser {
  //interface 설정
  user: {
    id: string;
    name: string;
    profileImgUrl: string;
    // email: string;
  };
}

@Controller('auth') //컨트롤러 데코레이터
export class AuthController {
  //클래스이름
  constructor(
    //컨스트럭터로 초기값설정
    private readonly authService: AuthService,
  ) {}

  //   //-----------------------구글 로그인-----------------------------//
  //   @Get('/login/google') //restAPI만들기. 엔드포인트는 /login/google.
  //   @UseGuards(AuthGuard('google')) //인증과정을 거쳐야하기때문에 UseGuards를 써주고 passport인증으로 AuthGuard를 써준다. 이름은 google로
  //   async loginGoogle(
  //     @Req() req: Request & IOAuthUser,
  //     @Res() res: Response, //Nest.js가 express를 기반으로 하기때문에 Request는 express에서 import한다.
  //   ) {
  //     //프로필을 받아온 다음, 로그인 처리해야하는 곳(auth.service.ts에서 선언해준다)
  //     this.authService.OAuthLogin({ req, res });
  //   }

  @Get('/kakaoCallback')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    const { accessToken } = await this.authService.kakaoLogin({
      id: req.user.id,
      name: req.user.name,
      profileImgUrl: req.user.profileImgUrl,
    });
    res.status(200).json({ token: accessToken });
    return;
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('sign-up')
  // @UsePipes(new ValidationPipe())
  // async signUp(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() afterSocialSignUpDTO: AfterSocialSignUpDTO,
  // ) {
  //   this.authService.afterSocialSignUp({
  //     userId: req.user.id,
  //     afterSocialSignUpDTO,
  //   });
  //   res.status(200).send();
  //   return;
  // }
}
