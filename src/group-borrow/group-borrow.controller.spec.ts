import { Test, TestingModule } from '@nestjs/testing';
import { GroupBorrowController } from './group-borrow.controller';
import { GroupBorrowService } from './group-borrow.service';

describe('GroupBorrowController', () => {
  let controller: GroupBorrowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupBorrowController],
      providers: [GroupBorrowService],
    }).compile();

    controller = module.get<GroupBorrowController>(GroupBorrowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
