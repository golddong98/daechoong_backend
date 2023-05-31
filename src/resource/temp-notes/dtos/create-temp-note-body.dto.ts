import { IsString } from 'class-validator';

export class CreateTempNoteBodyDTO {
  @IsString()
  readonly content: string;
}
