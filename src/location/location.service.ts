import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { InjectRepository } from '@nestjs/typeorm';
import { getResponse } from 'src/utils/response';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) { }
  create(createLocationDto: CreateLocationDto) {
    let result = this.getLocation(createLocationDto);
    if (result == null) {
      this.locationRepository.save(createLocationDto);
      return getResponse('00', null);
    }
    else {
      throw new HttpException(getResponse('08', null), HttpStatus.FORBIDDEN);
    }
  }

  async findAll() {
    let result = await this.locationRepository.find();
    return getResponse('00', result);
  }

  async findOne(id: number) {
    let result = await this.locationRepository.findOne(id);
    return getResponse('00', result);
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    await this.locationRepository.save({ id, ...updateLocationDto });
    return getResponse('00', null);
  }

  remove(id: number) {
    this.locationRepository.delete(id);
    return getResponse('00', null);
  }

  async getLocation(location: CreateLocationDto) {
    let result = await this.locationRepository.findOne({
      where: location
    })
    console.log('ggg ', result == null);
    return (result);
  }

  async findlocation(locate: Location) {
    let result = await this.locationRepository.findOne({
      where: locate
    })
    console.log('test', result);
    return result;
  }
}
