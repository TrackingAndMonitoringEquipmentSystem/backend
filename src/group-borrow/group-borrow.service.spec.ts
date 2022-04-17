import { Test, TestingModule } from '@nestjs/testing';
import { GroupBorrowService } from './group-borrow.service';

describe('GroupBorrowService', () => {
  let service: GroupBorrowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupBorrowService],
    }).compile();

    service = module.get<GroupBorrowService>(GroupBorrowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
