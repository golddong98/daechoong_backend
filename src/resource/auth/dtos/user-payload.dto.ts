import { IsNotEmpty, IsString } from 'class-validator';

export class UserPayloadDTO {
  @IsString()
  @IsNotEmpty({ message: '유저의 아이디가 존재하지 않습니다.' })
  readonly id: number;

  @IsString()
  @IsNotEmpty({ message: '유저의 이메일이 존재하지 않습니다.' })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: '유저의 이름이 존재하지 않습니다.' })
  readonly name: string;
}
