import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AfterSocialSignUpDTO {
  @IsString()
  @IsNotEmpty({ message: '학교 이름을 작성해주세요.' })
  readonly schoolName: string;

  @IsNumber()
  @IsNotEmpty({ message: '학번을 입력해주세요.' })
  readonly studentNumber: number;

  @IsString()
  @IsNotEmpty({ message: '전공을 입력해주세요.' })
  readonly major1: string;

  @IsString()
  readonly major2: string;

  @IsString()
  @IsNotEmpty({ message: '프로필 사진을 넣어주세요.' })
  readonly profileImgUrl: string;
}
