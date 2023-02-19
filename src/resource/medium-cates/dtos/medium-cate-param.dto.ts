import { IsNotEmpty, IsNumber } from 'class-validator';

export class MediumCateParamDTO {
  @IsNumber()
  @IsNotEmpty({ message: '대분류의 아이디를 기입해주세요.' })
  readonly largeCateId: number;
}
