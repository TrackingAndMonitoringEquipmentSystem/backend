import { forwardRef, Module } from '@nestjs/common';
import { TemporaryUserService } from './temporary-user.service';
import { TemporaryUserController } from './temporary-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemporaryUser } from './entities/temporary-user.entity';
import { LockersModule } from 'src/lockers/lockers.module';
import { UsersModule } from 'src/users/users.module';
import { TemporaryDeptModule } from 'src/temporary-dept/temporary-dept.module';
import { LockersService } from 'src/lockers/lockers.service';

@Module({
  imports: [TypeOrmModule.forFeature([TemporaryUser]),forwardRef(() => LockersModule), UsersModule, forwardRef(() => TemporaryDeptModule)],
  controllers: [TemporaryUserController],
  providers: [TemporaryUserService],
  exports: [TemporaryUserService]
})
export class TemporaryUserModule {}
