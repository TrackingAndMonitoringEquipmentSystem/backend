import { Test, TestingModule } from '@nestjs/testing';
import { GroupRepairController } from './group-repair.controller';
import { GroupRepairService } from './group-repair.service';

describe('GroupRepairController', () => {
  let controller: GroupRepairController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupRepairController],
      providers: [GroupRepairService],
    }).compile();

    controller = module.get<GroupRepairController>(GroupRepairController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
