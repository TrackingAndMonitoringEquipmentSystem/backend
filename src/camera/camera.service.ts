import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LockersService } from 'src/lockers/lockers.service';
import { getResponse } from 'src/utils/response';
import { Repository } from 'typeorm';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';
import { Camera } from './entities/camera.entity';

@Injectable()
export class CameraService {
  constructor(
    @InjectRepository(Camera)
    private cameraRepository: Repository<Camera>,
    private readonly lockersService: LockersService,
  ) {}
  async create(createCameraDto: CreateCameraDto) {
    let lockerInfo = await this.lockersService.findLocker(createCameraDto.locker);
    console.log('locker', lockerInfo);
    let camera = await this.cameraRepository.create({
      ...createCameraDto,
      locker: lockerInfo,
    }) 
    this.cameraRepository.save(camera);
    return getResponse('00', null);
  }

  async findAll() {
    let result = await this.cameraRepository.find({
      relations: ['locker']
    });
    return getResponse('00', result);
  }

  async findOne(locker: number, camera: number) {
    let result = await this.cameraRepository.findOne({
      relations: ['locker'],
      where: {
        camera_id: camera,
        locker: locker
      }
    })
    if (result) {
      return getResponse('00', result) ;
    } 
    
    throw new HttpException(getResponse('13', null), HttpStatus.FORBIDDEN);
    
    
  }

  update(locker: number, camera: number, updateCameraDto: UpdateCameraDto) {  //ไปดูว่าต้องใช้วิธีไหน
    return `This action updates a  camera`;
  }

  async remove(locker: number, camera: number) {
    let result = await this.cameraRepository.findOne({
      relations: ['locker'],
      where: {
        camera_id: camera,
        locker: locker
      }
    }) 
    if(result == null) {
      throw new HttpException(getResponse('13', null), HttpStatus.FORBIDDEN);
    }
    this.cameraRepository.remove(result);
    return getResponse('00', null);
  }
}
