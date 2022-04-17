import { Module } from '@nestjs/common';
import { GroupBorrowService } from './group-borrow.service';
import { GroupBorrowController } from './group-borrow.controller';
import { GroupBorrow } from './entities/group-borrow.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GroupBorrow])],
  controllers: [GroupBorrowController],
  providers: [GroupBorrowService],
  exports: [GroupBorrowService]
})
export class GroupBorrowModule {}
