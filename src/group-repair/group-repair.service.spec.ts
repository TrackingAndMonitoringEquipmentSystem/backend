import { Test, TestingModule } from '@nestjs/testing';
import { GroupRepairService } from './group-repair.service';

describe('GroupRepairService', () => {
  let service: GroupRepairService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupRepairService],
    }).compile();

    service = module.get<GroupRepairService>(GroupRepairService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
