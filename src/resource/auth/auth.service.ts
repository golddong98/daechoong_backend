import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { LargeCatesService } from '../large-cates/large-cates.service';
// import { MediumCatesService } from '../medium-cates/medium-cates.service';
import { UsersService } from '../users/users.service';
// import {
//   IAuthServiceGetAccessToken,
//   IAuthServiceSetRefreshToken,
// } from './interfaces/auth-service.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    // private readonly largeCatesService: LargeCatesService,
    // private readonly mediumCatesService: MediumCatesService,
    private readonly jwtService: JwtService,
  ) {}

  async kakaoLogin({ id, name, profileImgUrl }) {
    // 1. 회원조회
    let user = await this.usersService.getUserByIdAtFirst({ id });
    // let user = await this.usersService.getUserByEmail(id); //user를 찾아서

    // 2, 회원가입이 안되어있다면? 자동회원가입

    // kakaostrategy
    if (!user) {
      user = await this.usersService.registerUser({ id, name, profileImgUrl }); //user가 없으면 하나 만들고, 있으면 이 if문에 들어오지 않을거기때문에 이러나 저러나 user는 존재하는게 됨.

      //아래 대신 이제 튜토리얼 넣어야됨
    }

    // jwtstrategy
    // 4. 회원가입이 되어있다면? 로그인(AT, RT를 생성해서 브라우저에 전송)한다
    // this.setRefreshToken({ user, res });
    const payload = {
      id: user.id,
      name: user.name,
      profileImgUrl: user.profileImgUrl,
    };
    const accessToken = this.jwtService.sign(payload);
    // const isActive = user.isActive;
    return { accessToken };
  }

  // usersService에 업데이트에 넣으면 될듯 + 회원가입후 필수적으로 작성하도록 로직짜야됨
  // async afterSocialSignUp({ userId, afterSocialSignUpDTO }) {
  //   return this.usersService.afterSignUpUpdateUser({
  //     userId,
  //     afterSocialSignUpDTO,
  //   });
  // }
}
