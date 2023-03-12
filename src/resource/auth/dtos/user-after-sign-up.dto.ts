import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidationOptions,
} from 'class-validator';

export class AfterSocialSignUpDTO {
  @IsString({
    message: '학교 이름의 형식이 다르거나 요청형식에 포함되지 않았습니다.',
  })
  @IsNotEmpty({ message: '학교 이름이 비어있습니다.' })
  readonly schoolName: string;

  @IsNumber(undefined, {
    message: '학번의 형식이 다르거나 요청형식에 포함되지 않았습니다.',
  } as ValidationOptions)
  @IsNotEmpty({ message: '학번이 비어있습니다.' })
  readonly studentNumber: number;

  @IsString({
    message: '1전공의 형식이 다르거나 요청형식에 포함되지 않았습니다.',
  })
  @IsNotEmpty({ message: '전공이 비어있습니다.' })
  readonly major1: string;

  @IsString({
    message: '2전공의 형식이 다르거나 요청형식에 포함되지 않았습니다.',
  })
  readonly major2: string;

  @IsString({
    message: '프로필 사진의 형식이 다르거나 요청형식에 포함되지 않았습니다.',
  })
  @IsNotEmpty({ message: '프로필 사진의 URL이 비어있습니다.' })
  readonly profileImgUrl: string;
}
