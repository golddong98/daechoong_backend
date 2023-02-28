import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { KakaoStrategy } from './kakao.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { LargeCatesModule } from '../large-cates/large-cates.module';
import { MediumCatesModule } from '../medium-cates/medium-cates.module';

@Module({
  imports: [
    UsersModule,
    LargeCatesModule,
    MediumCatesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  providers: [
    KakaoStrategy, //kakao소셜로그인
    AuthService, //service 주입
    JwtStrategy,
  ],
  controllers: [
    AuthController, //컨트롤러 주입
  ],
})
export class AuthModule {}
