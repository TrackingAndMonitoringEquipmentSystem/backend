import { Test, TestingModule } from '@nestjs/testing';
import { BorrowReturnController } from './borrow-return.controller';
import { BorrowReturnService } from './borrow-return.service';

describe('BorrowReturnController', () => {
  let controller: BorrowReturnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowReturnController],
      providers: [BorrowReturnService],
    }).compile();

    controller = module.get<BorrowReturnController>(BorrowReturnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
