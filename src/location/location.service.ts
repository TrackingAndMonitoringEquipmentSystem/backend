import { Building } from './entities/building.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getResponse } from 'src/utils/response';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { User } from 'src/users/entities/user.entity';
import { Room } from './entities/room.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) { }
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
    return getResponse('00', result);
  }

  async findRoomById(id: number) {
    const result = await this.roomRepository.findOne(id);
    return getResponse('00', result);
  }

  async viewByRoom(user: any) {
    if (user.role.role == 'super_admin') {
      const result = await this.roomRepository.find({
        relations: ['floor', 'lockers', 'floor.building'],
      });
      return getResponse('00', result);
    } else if (user.role.role == 'admin') {
      const departmentId = user.dept.id;
      const result = await this.roomRepository.createQueryBuilder('room')
        .innerJoinAndSelect('room.floor', 'floor')
        .innerJoinAndSelect('floor.building', 'building')
        .innerJoinAndSelect('room.lockers', 'lockers')
        .innerJoin('lockers.department', 'department')
        .where('department.id = :departmentId', { departmentId })
        .getMany();
      return getResponse('00', result)
    }
  }

  async viewEquipment(typeId: number, status: string, user: any) {
    const departmentId = user.dept.id;
    let result;
    console.log('-->type:', typeId);
    console.log('-->status', status);
    if (typeId == 0) {
      // console.log('1');
      if (status == 'ยืมอยู่') {
        result = await this.roomRepository.createQueryBuilder('room')
          .innerJoinAndSelect('room.floor', 'floor')
          .innerJoinAndSelect('floor.building', 'building')
          .innerJoinAndSelect('room.lockers', 'lockers')
          .innerJoin('lockers.department', 'department')
          .innerJoinAndSelect('lockers.equipment', 'equipment')
          .innerJoinAndSelect('equipment.borrowReturns', 'borrowReturns')
          .where('department.id = :departmentId', { departmentId })
          .andWhere('equipment.type IS NULL')
          .andWhere('equipment.status = :status', { status: status })
          .andWhere('borrowReturns.return_at IS NULL')
          .getMany()
      } else if (status == 'ส่งซ่อม') {
        result = await this.roomRepository.createQueryBuilder('room')
          .innerJoinAndSelect('room.floor', 'floor')
          .innerJoinAndSelect('floor.building', 'building')
          .innerJoinAndSelect('room.lockers', 'lockers')
          .innerJoin('lockers.department', 'department')
          .innerJoinAndSelect('lockers.equipment', 'equipment')
          .innerJoinAndSelect('equipment.repairs', 'repairs')
          .where('department.id = :departmentId', { departmentId })
          .andWhere('equipment.type IS NULL')
          .andWhere('equipment.status = :status', { status: status })
          .andWhere('repairs.status = :repairStatus', { repairStatus: 'รับเรื่องแจ้งซ่อม' })
          .getMany()
      } else if (status == 'พร้อมใช้งาน') {
        result = await this.roomRepository.createQueryBuilder('room')
          .innerJoinAndSelect('room.floor', 'floor')
          .innerJoinAndSelect('floor.building', 'building')
          .innerJoinAndSelect('room.lockers', 'lockers')
          .innerJoin('lockers.department', 'department')
          .innerJoinAndSelect('lockers.equipment', 'equipment')
          .where('department.id = :departmentId', { departmentId })
          .andWhere('equipment.type IS NULL')
          .andWhere('equipment.status = :status', { status: status })
          .getMany()
      }
      return getResponse('00', result);
    } else if (typeId > 0) {
      // console.log('2');
      if (status == 'ยืมอยู่') {
        result = await this.roomRepository.createQueryBuilder('room')
          .innerJoinAndSelect('room.floor', 'floor')
          .innerJoinAndSelect('floor.building', 'building')
          .innerJoinAndSelect('room.lockers', 'lockers')
          .innerJoin('lockers.department', 'department')
          .innerJoinAndSelect('lockers.equipment', 'equipment')
          .innerJoinAndSelect('equipment.borrowReturns', 'borrowReturns')
          .where('department.id = :departmentId', { departmentId })
          .andWhere('equipment.type = :type', { type: typeId })
          .andWhere('equipment.status = :status', { status: status })
          .andWhere('borrowReturns.return_at IS NULL')
          .getMany()
      } else if (status == 'ส่งซ่อม') {
        result = await this.roomRepository.createQueryBuilder('room')
          .innerJoinAndSelect('room.floor', 'floor')
          .innerJoinAndSelect('floor.building', 'building')
          .innerJoinAndSelect('room.lockers', 'lockers')
          .innerJoin('lockers.department', 'department')
          .innerJoinAndSelect('lockers.equipment', 'equipment')
          .innerJoinAndSelect('equipment.repairs', 'repair')
          .where('department.id = :departmentId', { departmentId })
          .andWhere('equipment.type = :type', { type: typeId })
          .andWhere('equipment.status = :status', { status: status })
          .andWhere('repairs.status = :repairStatus', { repairStatus: 'รับเรื่องแจ้งซ่อม' })
          .getMany()
      } else if (status == 'พร้อมใช้งาน') {
        result = await this.roomRepository.createQueryBuilder('room')
          .innerJoinAndSelect('room.floor', 'floor')
          .innerJoinAndSelect('floor.building', 'building')
          .innerJoinAndSelect('room.lockers', 'lockers')
          .innerJoin('lockers.department', 'department')
          .innerJoinAndSelect('lockers.equipment', 'equipment')
          .where('department.id = :departmentId', { departmentId })
          .andWhere('equipment.type = :type', { type: typeId })
          .andWhere('equipment.status = :status', { status: status })
          .getMany()
      }
      return getResponse('00', result);
    }
  }
}
