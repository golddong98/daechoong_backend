import { Injectable } from '@nestjs/common';

@Injectable()
export class MediumCatesService {
  getMediumCates(): string {
    return 'Hello mediumCates!';
  }
}
