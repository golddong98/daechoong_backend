import { IsNotEmpty, IsString } from 'class-validator';

export class MediumCateCreateDTO {
  @IsString()
  @IsNotEmpty({ message: '중분류를 기입해주세요' })
  readonly mediumCateName: string;
}
