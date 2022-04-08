import { Test, TestingModule } from '@nestjs/testing';
import { TemporaryDeptService } from './temporary-dept.service';

describe('TemporaryDeptService', () => {
  let service: TemporaryDeptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemporaryDeptService],
    }).compile();

    service = module.get<TemporaryDeptService>(TemporaryDeptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
