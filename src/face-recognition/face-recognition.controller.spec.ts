import { Test, TestingModule } from '@nestjs/testing';
import { FaceRecognitionController } from './face-recognition.controller';

describe('FaceRecognitionController', () => {
  let controller: FaceRecognitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaceRecognitionController],
    }).compile();

    controller = module.get<FaceRecognitionController>(FaceRecognitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
