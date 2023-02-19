import { IsNotEmpty, IsString } from 'class-validator';

export class SmallCateNameUpdateDTO {
  @IsString()
  @IsNotEmpty({ message: '소분류를 기입해주세요' })
  readonly smallCateName: string;
}
