import { Module } from '@nestjs/common';
import { GroupRepairService } from './group-repair.service';
import { GroupRepairController } from './group-repair.controller';
import { GroupRepair } from './entities/group-repair.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepair]), UsersModule],
  controllers: [GroupRepairController],
  providers: [GroupRepairService],
  exports: [GroupRepairService]
})
export class GroupRepairModule {}
