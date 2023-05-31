import { IsNotEmpty, IsString } from 'class-validator';

export class CateCreateDTO {
  @IsString()
  @IsNotEmpty({ message: '항목의 이름이 존재하지 않습니다.' })
  readonly cateName: string;
  //   @IsString()
  //   @IsNotEmpty({ message: '유저의 이메일이 존재하지 않습니다.' })
  //   readonly email: string;
  //   @IsString()
  //   @IsNotEmpty({ message: '유저의 이름이 존재하지 않습니다.' })
  //   readonly name: string;
}
