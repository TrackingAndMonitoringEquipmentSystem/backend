import { Module } from '@nestjs/common';
import { FaceRecognitionService } from './face-recognition.service';
import { FaceRecognitionController } from './face-recognition.controller';

@Module({
  providers: [FaceRecognitionService],
  controllers: [FaceRecognitionController]
})
export class FaceRecognitionModule { }
