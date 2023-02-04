import { Test, TestingModule } from '@nestjs/testing';
import { LargeCatesController } from './large-cates.controller';

describe('LargeCatesController', () => {
  let controller: LargeCatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LargeCatesController],
    }).compile();

    controller = module.get<LargeCatesController>(LargeCatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
