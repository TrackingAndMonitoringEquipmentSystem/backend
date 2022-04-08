import { forwardRef, Module } from '@nestjs/common';
import { TemporaryDeptService } from './temporary-dept.service';
import { TemporaryDeptController } from './temporary-dept.controller';
import { TemporaryDept } from './entities/temporary-dept.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LockersModule } from 'src/lockers/lockers.module';
import { DepartmentModule } from 'src/department/department.module';
import { UsersModule } from 'src/users/users.module';
import { TemporaryUserModule } from 'src/temporary-user/temporary-user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TemporaryDept]), forwardRef(() => LockersModule), DepartmentModule, UsersModule, forwardRef(() => TemporaryUserModule)],
  controllers: [TemporaryDeptController],
  providers: [TemporaryDeptService],
  exports: [TemporaryDeptService]
})
export class TemporaryDeptModule {}
