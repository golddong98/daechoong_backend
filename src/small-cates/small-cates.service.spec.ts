import { Test, TestingModule } from '@nestjs/testing';
import { SmallCatesService } from './small-cates.service';

describe('SmallCatesService', () => {
  let service: SmallCatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmallCatesService],
    }).compile();

    service = module.get<SmallCatesService>(SmallCatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
