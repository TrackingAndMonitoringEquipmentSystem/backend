import { Building } from './entities/building.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getResponse } from 'src/utils/response';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
  ) {}
  create(createLocationDto: CreateLocationDto, user: User) {
    console.log('->user:', user);
    // let building: Building;
    // if (!createLocationDto.buildingId) {
    //   building = this.buildingRepository.create(createLocationDto);
    // }
    throw new Error('Method not implemented.');
  }

  // async findAll() {
  //   const result = await this.locationRepository.find();
  //   return getResponse('00', result);
  // }

  // async findOne(id: number) {
  //   const result = await this.locationRepository.findOne(id);
  //   return getResponse('00', result);
  // }

  // async update(id: number, updateLocationDto: UpdateLocationDto) {
  //   await this.locationRepository.save({ id, ...updateLocationDto });
  //   return getResponse('00', null);
  // }

  // remove(id: number) {
  //   this.locationRepository.delete(id);
  //   return getResponse('00', null);
  // }

  // async getLocation(location: CreateLocationDto) {
  //   const result = await this.locationRepository.findOne({
  //     where: location,
  //   });
  //   console.log('ggg ', result == null);
  //   return result;
  // }

  // async findlocation(locate: Location) {
  //   const result = await this.locationRepository.findOne({
  //     where: locate,
  //   });
  //   console.log('test', result);
  //   return result;
  // }

  async getAllBuilding() {
    const result = await this.buildingRepository.find({
      relations: ['floors', 'floors.rooms'],
    });
    return result;
  }
}
