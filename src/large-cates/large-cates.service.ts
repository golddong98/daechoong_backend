import { Injectable } from '@nestjs/common';

@Injectable()
export class LargeCatesService {
  getLargeCates(): string {
    return 'Hello largeCates!';
  }
}
