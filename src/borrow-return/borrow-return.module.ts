import { Module } from '@nestjs/common';
import { BorrowReturnService } from './borrow-return.service';
import { BorrowReturnController } from './borrow-return.controller';
import { BorrowReturn } from './entities/borrow-return.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupBorrowModule } from 'src/group-borrow/group-borrow.module';
import { EquipmentModule } from 'src/equipment/equipment.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([BorrowReturn]), GroupBorrowModule, EquipmentModule, UsersModule],
  controllers: [BorrowReturnController],
  providers: [BorrowReturnService],
  exports: [BorrowReturnService]
})
export class BorrowReturnModule {}
