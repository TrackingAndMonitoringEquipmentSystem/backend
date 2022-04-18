import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { Equipment } from './entities/equipment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { LockersModule } from 'src/lockers/lockers.module';
import { TypeEquipmentModule } from 'src/type-equipment/type-equipment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Equipment]),UsersModule, LockersModule],
  controllers: [EquipmentController],
  providers: [EquipmentService],
  exports: [EquipmentService]
})
export class EquipmentModule {}
