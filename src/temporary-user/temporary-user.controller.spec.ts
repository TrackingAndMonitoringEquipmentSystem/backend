import { Test, TestingModule } from '@nestjs/testing';
import { TemporaryUserController } from './temporary-user.controller';
import { TemporaryUserService } from './temporary-user.service';

describe('TemporaryUserController', () => {
  let controller: TemporaryUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemporaryUserController],
      providers: [TemporaryUserService],
    }).compile();

    controller = module.get<TemporaryUserController>(TemporaryUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
