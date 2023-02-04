import { Test, TestingModule } from '@nestjs/testing';
import { SmallCatesController } from './small-cates.controller';

describe('SmallCatesController', () => {
  let controller: SmallCatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmallCatesController],
    }).compile();

    controller = module.get<SmallCatesController>(SmallCatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
