import { forwardRef, Get, HttpCode, HttpException, HttpStatus, Inject, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationService } from 'src/location/location.service';
import { getResponse } from 'src/utils/response';
import { In, Repository } from 'typeorm';
import { CreateLockerDto } from './dto/create-locker.dto';
import { UpdateLockerDto } from './dto/update-locker.dto';
import { Locker } from './entities/locker.entity';
import { DepartmentService } from 'src/department/department.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Department } from 'src/department/entities/department.entity';
import { TemporaryUserService } from 'src/temporary-user/temporary-user.service';
import { TemporaryDeptService } from 'src/temporary-dept/temporary-dept.service';


@Injectable()
export class LockersService {
  constructor(
    @InjectRepository(Locker)
    private lockerRepository: Repository<Locker>,
    private readonly locationService: LocationService,
    private readonly departmentService: DepartmentService,
    private readonly userService: UsersService,
    private readonly tempUserService: TemporaryUserService,
    private readonly tempDeptService: TemporaryDeptService,
    private jwtService: JwtService,
  ) { }

  async register(lockerId: number,createLockerDto: CreateLockerDto, actor:any ) {
    let findLocker = await this.lockerRepository.findOne({
      where: {
        locker_id: lockerId
      }
    });
    if (findLocker && findLocker.status == 'unregister') {
      let location = await this.locationService.findlocation(createLockerDto.location);
      let dept = await this.departmentService.findDept(createLockerDto.deptId);
      let user = await this.userService.findByEmail(actor.email);
      if (location != null) {
        await this.lockerRepository.save({
          locker_id: lockerId,
          ...createLockerDto,
          location: location,
          created_by: user,
          updated_by: user,
          department: dept,
          status: 'registered'
        });
        let result = await this.lockerRepository.findOne(lockerId);
        return getResponse('00', result);
      } else {
        throw new HttpException(getResponse('10', null), HttpStatus.FORBIDDEN);
      }
    } 
    throw new HttpException(getResponse('09', null), HttpStatus.FORBIDDEN); 
  }

  async preRegis(actor) {
    let user = await this.userService.findByEmail(actor.email);
    let locker =  this.lockerRepository.create({
      status: 'unregister',
      created_by: user,
      updated_by: user,
      description: null,
      locker_name: null,
      location: null,
    });
    await this.lockerRepository.save(locker);
    return getResponse('00', locker);
  }

  async findAll() {
    const result = await this.lockerRepository.find();
    return getResponse('00', result);
  }

  async find(id: string) {
    console.log('id', typeof id);
    let lockerIds = id.split(',').map(Number);
    let result = await this.lockerRepository.findByIds(lockerIds,
      {
        relations: ['location', 'department']
      });
    if (lockerIds.length == result.length) {
      return getResponse('00', result);
    } else {
      throw new HttpException(getResponse('12', null), HttpStatus.FORBIDDEN);
    }
  }

  async update(id: number, updateLockerDto: UpdateLockerDto, actor: any) {
    let user = await this.userService.findByEmail(actor.email);
    await this.lockerRepository.save({ ...updateLockerDto, updated_by: user, locker_id: Number(id) });
    const result = await this.lockerRepository.findOne({
      where: { locker_id: id },
      relations: ['department', 'location', 'created_by', 'updated_by']
    });
    return getResponse('00', result);
  }

  async remove(id: number) {
    await this.lockerRepository.delete(id);
    return getResponse('00', null);
  }

  async getOpenToken(actor: any, lockerId:string) {
    const payload = { email: actor.email, lockerId: lockerId};
    return getResponse('00', this.jwtService.sign(payload));
  }

  async verifyToken(lockerId: number, data: any) {
    if(lockerId == data.lockerId) {
      return getResponse('00', data);
    }
    throw new HttpException(getResponse('20', null), HttpStatus.FORBIDDEN);
  }

  async validateFaceID(body: any, lockerId: string) {
    let user = await this.userService.findByfaceid(body.filename);
    let lockerDept = await this.findDept(lockerId);
    for (let i = 0; i < lockerDept.length; i++) {
      if ((user.dept.id == lockerDept[i].id) && (user.status != 'Blocked')) {
        return getResponse('00', null);
      } 
    }
    const date: Date = new Date();
      let tempUser = await this.tempUserService.findtempUser(lockerId, user.id);
      let tempDept = await this.tempDeptService.findTempDept(lockerId, user.dept.id);
      if ((tempUser || tempDept) && (user.status != 'Blocked') ) {
        return getResponse('00', null);
      }
    throw new HttpException(getResponse('12', null), HttpStatus.FORBIDDEN);
  }

  async findByIds(ids: string) {
    let lockerIds = ids.split(',').map(Number);
    let result = await this.lockerRepository.find({
      where: { locker_id: In(lockerIds) },
      relations: ['location', 'department']
    })
    console.log('test', result[0].department[0].id);
    return result;
  }

  async findDept(id: Department | number | string) {
    let result = await this.lockerRepository.findOne({
      where: { locker_id: id },
      relations: ['department']
    });
   if(result) {
      return result.department;
   }
  }

  async findLocker(id: number | Locker) {
    let result = await this.lockerRepository.findOne({
      where: { locker_id: id},
      relations: ['department']
    })
    return result;
  }
}
