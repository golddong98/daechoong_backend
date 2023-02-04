import { Test, TestingModule } from '@nestjs/testing';
import { MediumCatesService } from './medium-cates.service';

describe('MediumCatesService', () => {
  let service: MediumCatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediumCatesService],
    }).compile();

    service = module.get<MediumCatesService>(MediumCatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
