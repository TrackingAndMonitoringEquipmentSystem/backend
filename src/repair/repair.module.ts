import { Module } from '@nestjs/common';
import { RepairService } from './repair.service';
import { RepairController } from './repair.controller';
import { Repair } from './entities/repair.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentModule } from 'src/equipment/equipment.module';
import { UsersModule } from 'src/users/users.module';
import { GroupRepairModule } from 'src/group-repair/group-repair.module';

@Module({
  imports: [TypeOrmModule.forFeature([Repair]), EquipmentModule, UsersModule, GroupRepairModule],
  controllers: [RepairController],
  providers: [RepairService]
})
export class RepairModule {}
