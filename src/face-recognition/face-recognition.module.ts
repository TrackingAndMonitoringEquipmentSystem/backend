import { Module } from '@nestjs/common';
import { FaceRecognitionService } from './face-recognition.service';
import { FaceRecognitionController } from './face-recognition.controller';
import { LockersModule } from 'src/lockers/lockers.module';

@Module({
  imports: [LockersModule],
  providers: [FaceRecognitionService],
  controllers: [FaceRecognitionController],
})
export class FaceRecognitionModule {}
