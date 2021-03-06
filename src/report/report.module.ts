import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Report } from './entities/report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentModule } from 'src/equipment/equipment.module';
import { UsersModule } from 'src/users/users.module';
import { BorrowReturnModule } from 'src/borrow-return/borrow-return.module';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), EquipmentModule, UsersModule, BorrowReturnModule],
  controllers: [ReportController],
  providers: [ReportService]
})
export class ReportModule {}
