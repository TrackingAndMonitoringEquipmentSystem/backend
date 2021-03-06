import { Controller, Get, Param, Delete } from '@nestjs/common';
import { VideoRecordService } from './video-record.service';

@Controller('locker/video-record')
export class VideoRecordController {
  constructor(private readonly videoRecordService: VideoRecordService) {}

  /* @Post()
  create(@Body() createVideoRecordDto: CreateVideoRecordDto) {
    return this.videoRecordService.create(createVideoRecordDto);
  }

  @Get()
  findAll() {
    return this.videoRecordService.findAll();
  }*/

  @Get(':locker/:video')
  findOne(@Param('locker') lockerId: string, @Param('video') videoId: string) {
    return this.videoRecordService.findOne(+lockerId, +videoId);
  }

  /* @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoRecordDto: UpdateVideoRecordDto) {
    return this.videoRecordService.update(+id, updateVideoRecordDto);
  }*/

  @Delete(':locker/:video')
  remove(@Param('locker') lockerId: string, @Param('video') videoId: string) {
    return this.videoRecordService.remove(+lockerId, +videoId);
  }
}
