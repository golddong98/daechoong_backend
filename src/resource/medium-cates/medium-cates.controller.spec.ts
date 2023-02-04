import { Test, TestingModule } from '@nestjs/testing';
import { MediumCatesController } from './medium-cates.controller';

describe('MediumCatesController', () => {
  let controller: MediumCatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediumCatesController],
    }).compile();

    controller = module.get<MediumCatesController>(MediumCatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
