import { Test, TestingModule } from '@nestjs/testing';
import { TemporaryUserService } from './temporary-user.service';

describe('TemporaryUserService', () => {
  let service: TemporaryUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemporaryUserService],
    }).compile();

    service = module.get<TemporaryUserService>(TemporaryUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
