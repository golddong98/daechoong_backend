import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';
import { UserKakaoDTO } from './dtos/user.kakao.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID'),
      clientSecret: configService.get('KAKAO_CLIENT_SECRET'),
      callbackURL: configService.get('KAKAO_CALLBACK_URL'),
      scope: ['profile_image', 'profile_nickname'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done,
  ) {
    // console.log('accessToken'+accessToken)
    // console.log('refreshToken'+refreshToken)
    // console.log(profile);
    // console.log(profile._json.kakao_account.email)

    const profileJson = profile._json;
    const kakao_account = profileJson.kakao_account;
    const payload: UserKakaoDTO = {
      id: profileJson.id,
      name: kakao_account.profile.nickname,
      profileImgUrl: kakao_account.profile.thumbnail_image_url,
      // email:
      //   kakao_account.has_email && !kakao_account.email_needs_agreement
      //     ? kakao_account.email
      //     : null,
    };
    done(null, payload);
  }
}
