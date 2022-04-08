import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LockersService } from 'src/lockers/lockers.service';
import { getResponse } from 'src/utils/response';
import { Repository } from 'typeorm';
import { CreateVideoRecordDto } from './dto/create-video-record.dto';
import { UpdateVideoRecordDto } from './dto/update-video-record.dto';
import { VideoRecord } from './entities/video-record.entity';

@Injectable()
export class VideoRecordService {
  constructor(
    @InjectRepository(VideoRecord)
    private videoRepository: Repository<VideoRecord>,
    private readonly lockersService: LockersService,
  ) { }
  async create(lockerId: number, createVideoRecordDto: CreateVideoRecordDto) {
    let locker = await this.lockersService.findLocker(lockerId);
    let video = this.videoRepository.create({
      ...createVideoRecordDto,
      locker: locker
    });
    await this.videoRepository.save(video)
    return getResponse('00', video);
  }

  async findAll() {
    let result = await this.videoRepository.find(); 
    return result;
  }

  async findOne(lockerId: number, videoId: number ) {
    let result = await this.videoRepository.findOne({
      where: {
        locker: lockerId,
        file_id: videoId
      }
    });
    if (result) {
      return getResponse('00', result);
    }
    throw new HttpException(getResponse('19', null), HttpStatus.FORBIDDEN);
  }

  async update(lockerId: number, videoId: number, updateVideoRecordDto: UpdateVideoRecordDto) {
    let locker = await this.lockersService.findLocker(lockerId);
    let video = await this.videoRepository.save({
      ...updateVideoRecordDto,
      locker: locker,
      file_id: videoId,
    })
    let result = await this.videoRepository.findOne(videoId);
    if(result) {
      return getResponse('00', result);
    }
    throw new HttpException(getResponse('19', null),HttpStatus.FORBIDDEN);
  }

  async remove(lockerId: number, videoId: number) {
    let result = await this.videoRepository.findOne({
      where: {
        locker: lockerId,
        file_id: videoId
      }
    });
    if (result) {
      await this.videoRepository.delete(result);
      return getResponse('00', null);
    } else {
      throw new HttpException(getResponse('19', null), HttpStatus.FORBIDDEN);
    }
  }

  async viewVideo(lockerId: number, videoId: number) {
    let result = await this.videoRepository.findOne({
      where: {
        locker: lockerId,
        file_id: videoId
      }
    });
    return result.file_name;
  }
}
