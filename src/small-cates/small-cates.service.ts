import { Injectable } from '@nestjs/common';

@Injectable()
export class SmallCatesService {
  getSmallCates(): string {
    return 'Hello smallCates!';
  }
}
