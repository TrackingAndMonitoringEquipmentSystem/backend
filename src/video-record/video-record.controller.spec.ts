import { Test, TestingModule } from '@nestjs/testing';
import { VideoRecordController } from './video-record.controller';
import { VideoRecordService } from './video-record.service';

describe('VideoRecordController', () => {
  let controller: VideoRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoRecordController],
      providers: [VideoRecordService],
    }).compile();

    controller = module.get<VideoRecordController>(VideoRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
