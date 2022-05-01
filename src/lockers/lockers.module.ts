import { forwardRef, Module } from '@nestjs/common';
import { LockersService } from './lockers.service';
import { LockersController } from './lockers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locker } from './entities/locker.entity';
import { LocationModule } from 'src/location/location.module';
import { UsersModule } from 'src/users/users.module';
import { DepartmentModule } from 'src/department/department.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './JwtConstants';
import { JwtStrategy } from './jwt.strategy';
import { TemporaryDeptModule } from 'src/temporary-dept/temporary-dept.module';
import { TemporaryUserModule } from 'src/temporary-user/temporary-user.module';
import { LockerGateway } from './locker.gateway';
import { CameraModule } from 'src/camera/camera.module';
import { Camera } from 'src/camera/entities/camera.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Locker, Camera]),
    LocationModule,
    UsersModule,
    DepartmentModule,
    forwardRef(() => TemporaryUserModule),
    forwardRef(() => TemporaryDeptModule),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    forwardRef(() => CameraModule),
  ],
  controllers: [LockersController],
  providers: [LockersService, JwtStrategy, LockerGateway],
  exports: [LockersService, LockerGateway],
})
export class LockersModule {}
