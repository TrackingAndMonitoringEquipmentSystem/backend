import { Module } from '@nestjs/common';
import { CameraService } from './camera.service';
import { CameraController } from './camera.controller';
import { Camera } from './entities/camera.entity';
import { LockersModule } from 'src/lockers/lockers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Camera]), LockersModule, UsersModule],
  controllers: [CameraController],
  providers: [CameraService],
  exports: [CameraService]
})
export class CameraModule {}
