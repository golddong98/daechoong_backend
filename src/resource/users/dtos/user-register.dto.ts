import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
// import { User } from 'src/database/entities/users.entity';

export class UserRegisterDTO {
  @IsNumber()
  @IsNotEmpty({ message: '아이디가 존재하지 않습니다.' })
  readonly id: number;

  @IsString()
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: '이름을 작성해주세요.' })
  readonly name: string;
  //   @IsString()
  //   @IsNotEmpty({ message: '대학교 이름을 작성해주세요.' })
  //   readonly schoolNmae: string;
  //   @IsNumber()
  //   @IsNotEmpty({ message: '학번을 작성해주세요.' })
  //   readonly studentNumber: string;
  //   @IsString()
  //   @IsNotEmpty({ message: '학과를 작성해주세요.' })
  //   readonly major1: string;
  //   @IsString()
  //   @IsOptional()
  //   readonly major2: string;
}
