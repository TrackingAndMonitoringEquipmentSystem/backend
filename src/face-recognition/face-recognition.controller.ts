import { Body, Controller, Post } from '@nestjs/common';
import { FaceRecognitionService } from './face-recognition.service';

@Controller('face-recognition')
export class FaceRecognitionController {
  constructor(private faceRecognitionService: FaceRecognitionService) {}

  @Post('validate-face-id')
  async validateFaceId(@Body() body: any): Promise<any> {
    return this.faceRecognitionService.validateFaceId(
      Buffer.from(body.base64File, 'base64'),
      body.lockerId,
    );
  }
}
