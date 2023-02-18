import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class SmallCateCreateDTO {
  @IsString()
  @IsNotEmpty({ message: '소분류를 기입해주세요' })
  readonly smallCateName: string;

  @IsDate()
  @IsNotEmpty({ message: '시작일을 기입해주세요' })
  readonly startedAt: Date;

  @IsDate()
  @IsNotEmpty({ message: '종료일을 기입해주세요' })
  readonly endedAt: Date;
}
