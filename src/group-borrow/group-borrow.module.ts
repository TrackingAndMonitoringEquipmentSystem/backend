import { Module } from '@nestjs/common';
import { GroupBorrowService } from './group-borrow.service';
import { GroupBorrowController } from './group-borrow.controller';
import { GroupBorrow } from './entities/group-borrow.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupBorrow]), UsersModule],
  controllers: [GroupBorrowController],
  providers: [GroupBorrowService],
  exports: [GroupBorrowService]
})
export class GroupBorrowModule {}
