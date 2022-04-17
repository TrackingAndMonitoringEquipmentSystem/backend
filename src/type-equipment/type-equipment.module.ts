import { Module } from '@nestjs/common';
import { TypeEquipmentService } from './type-equipment.service';
import { TypeEquipmentController } from './type-equipment.controller';
import { TypeEquipment } from './entities/type-equipment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TypeEquipment]), UsersModule],
  controllers: [TypeEquipmentController],
  providers: [TypeEquipmentService],
  exports: [TypeEquipmentService]
})
export class TypeEquipmentModule {}
