import { IsString } from 'class-validator';

export class CreateNoteBodyDTO {
  @IsString()
  readonly content: string;
}
