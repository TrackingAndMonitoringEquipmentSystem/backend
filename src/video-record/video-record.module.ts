import { Module } from '@nestjs/common';
import { VideoRecordService } from './video-record.service';
import { VideoRecordController } from './video-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoRecord } from './entities/video-record.entity';
import { LockersModule } from 'src/lockers/lockers.module';

@Module({
  imports: [TypeOrmModule.forFeature([VideoRecord]), LockersModule],
  controllers: [VideoRecordController],
  providers: [VideoRecordService]
})
export class VideoRecordModule {}
