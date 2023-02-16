// import { IsNotEmpty, IsString } from 'class-validator';

import { IsNotEmpty, IsString } from 'class-validator';

export class MediumCateCreateDTO {
  @IsString()
  @IsNotEmpty({ message: '중분류를 기입해주세요' })
  readonly mediumCateName: string;
  //   @IsString()
  //   @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  //   readonly email: string;
  //   @IsString()
  //   @IsNotEmpty({ message: '이름을 작성해주세요.' })
  //   readonly name: string;
}
