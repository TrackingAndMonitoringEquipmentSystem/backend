import { Test, TestingModule } from '@nestjs/testing';
import { VideoRecordService } from './video-record.service';

describe('VideoRecordService', () => {
  let service: VideoRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoRecordService],
    }).compile();

    service = module.get<VideoRecordService>(VideoRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
