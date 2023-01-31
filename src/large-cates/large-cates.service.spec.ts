import { Test, TestingModule } from '@nestjs/testing';
import { LargeCatesService } from './large-cates.service';

describe('LargeCatesService', () => {
  let service: LargeCatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LargeCatesService],
    }).compile();

    service = module.get<LargeCatesService>(LargeCatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
