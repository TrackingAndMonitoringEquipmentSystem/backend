import { Test, TestingModule } from '@nestjs/testing';
import { TemporaryDeptController } from './temporary-dept.controller';
import { TemporaryDeptService } from './temporary-dept.service';

describe('TemporaryDeptController', () => {
  let controller: TemporaryDeptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemporaryDeptController],
      providers: [TemporaryDeptService],
    }).compile();

    controller = module.get<TemporaryDeptController>(TemporaryDeptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
