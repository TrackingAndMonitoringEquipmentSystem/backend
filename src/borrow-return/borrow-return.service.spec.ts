import { Test, TestingModule } from '@nestjs/testing';
import { BorrowReturnService } from './borrow-return.service';

describe('BorrowReturnService', () => {
  let service: BorrowReturnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BorrowReturnService],
    }).compile();

    service = module.get<BorrowReturnService>(BorrowReturnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
