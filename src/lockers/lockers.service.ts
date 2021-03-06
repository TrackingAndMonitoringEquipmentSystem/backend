import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { LockerGateway } from './locker.gateway';
import { CameraService } from 'src/camera/camera.service';
import { Camera } from 'src/camera/entities/camera.entity';

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
    private lockerGateway: LockerGateway,
    @InjectRepository(Camera)
    private cameraRepository: Repository<Camera>,
  ) {}

  async register(
    lockerId: number,
    createLockerDto: CreateLockerDto,
    actor: any,
  ) {
    const findLocker = await this.lockerRepository.findOne({
      where: {
        locker_id: lockerId,
      },
    });
    if (findLocker && findLocker.status == 'unregister') {
      const room = await this.locationService.findRoomById(
        createLockerDto.roomId,
      );
      const dept = await this.departmentService.findDept(
        createLockerDto.deptId,
      );
      console.log('->dept:', dept);
      const user = await this.userService.findByEmail(actor.email);
      if (room.successful) {
        await this.lockerRepository.save({
          locker_id: lockerId,
          ...createLockerDto,
          room: room.data,
          created_by: user,
          updated_by: user,
          department: dept,
          status: 'registered',
        });
        const result = await this.lockerRepository.findOne(lockerId, {
          relations: ['room', 'room.floor', 'room.floor.building'],
        });
        this.lockerGateway.emitLocketUpdate(result);
        return getResponse('00', result);
      } else {
        throw new HttpException(getResponse('10', null), HttpStatus.FORBIDDEN);
      }
    }
    throw new HttpException(getResponse('09', null), HttpStatus.FORBIDDEN);
  }

  async preRegis(numCamera: number) {
    const locker = this.lockerRepository.create({
      status: 'unregister',
      created_by: { id: 1 },
      updated_by: { id: 1 },
      num_camera: numCamera,
    });
    const newLocker = await this.lockerRepository.save(locker);
    const cameras: Camera[] = [];
    for (let i = 0; i < numCamera; i++) {
      cameras.push(
        this.cameraRepository.create({
          locker: newLocker,
          name: 'camera' + i + 1,
        }),
      );
    }
    await this.cameraRepository.save(cameras);
    return getResponse('00', newLocker);
  }

  async findAll(user: any) {
    if (user.role.role == 'super_admin') {
      const result = await this.lockerRepository.find({
        relations: ['room', 'room.floor', 'room.floor.building'],
        where: {
          status: 'registered',
        },
      });
      return getResponse('00', result);
    } else if (user.role.role == 'admin') {
      const departmentId = user.dept.id;
      const result = await this.lockerRepository
        .createQueryBuilder('locker')
        .innerJoin('locker.department', 'department')
        .innerJoinAndSelect('locker.room', 'room')
        .innerJoinAndSelect('room.floor', 'floor')
        .innerJoinAndSelect('floor.building', 'building')
        .where('department.id = :departmentId', { departmentId })
        // .where('locker.status = :status', { status: 'registered' })
        .getMany();
      console.log('->findAll result:', result);
      return getResponse('00', result);
    }
  }

  async viewAllByUser(user: any) {
    const departmentId = user.dept.id;
    const result = await this.lockerRepository
      .createQueryBuilder('locker')
      .innerJoin('locker.department', 'department')
      .innerJoinAndSelect('locker.room', 'room')
      .innerJoinAndSelect('room.floor', 'floor')
      .innerJoinAndSelect('floor.building', 'building')
      .where('department.id = :departmentId', { departmentId })
      .getMany();
    return getResponse('00', result);
  }

  async find(id: string) {
    const lockerIds = id.split(',').map(Number);
    console.log('->lockerIds:', lockerIds);
    const result = await this.lockerRepository.findByIds(lockerIds, {
      relations: [
        'room',
        'department',
        'equipment',
        'room.floor',
        'room.floor.building',
      ],
    });
    if (lockerIds.length == result.length) {
      console.log('->result:', result);
      return getResponse('00', result);
    } else {
      throw new HttpException(getResponse('12', null), HttpStatus.FORBIDDEN);
    }
  }

  async update(id: number, updateLockerDto: UpdateLockerDto, actor: any) {
    const user = await this.userService.findByEmail(actor.email);
    await this.lockerRepository.save({
      ...updateLockerDto,
      updated_by: user,
      locker_id: Number(id),
    });
    const result = await this.lockerRepository.findOne({
      where: { locker_id: id },
      relations: ['department', 'location', 'created_by', 'updated_by'],
    });
    return getResponse('00', result);
  }

  async remove(id: number) {
    await this.lockerRepository.delete(id);
    return getResponse('00', null);
  }

  async getOpenToken(actor: any, lockerId: string, state: boolean) {
    const payload = { email: actor.email, lockerId: lockerId };
    const user = await this.userService.findByEmail(actor.email);
    this.lockerGateway.toggleLocker(+lockerId, state, user.id);
    return getResponse('00', this.jwtService.sign(payload));
  }

  async verifyToken(lockerId: number, data: any) {
    if (lockerId == data.lockerId) {
      return getResponse('00', data);
    }
    throw new HttpException(getResponse('20', null), HttpStatus.FORBIDDEN);
  }

  async validateFaceID(body: any, lockerId: string) {
    const user = await this.userService.findByfaceid(
      `/face-id/${body.fileName}`,
    );
    const lockerDept = await this.findDept(lockerId);
    for (let i = 0; i < lockerDept.length; i++) {
      if (user.dept.id == lockerDept[i].id && user.status != 'Blocked') {
        return getResponse('00', null);
      }
    }
    const tempUser = await this.tempUserService.findtempUser(lockerId, user.id);
    const tempDept = await this.tempDeptService.findTempDept(
      lockerId,
      user.dept.id,
    );
    if ((tempUser || tempDept) && user.status != 'Blocked') {
      return getResponse('00', null);
    }
    throw new HttpException(getResponse('12', null), HttpStatus.FORBIDDEN);
  }

  async findByIds(ids: string) {
    const lockerIds = ids.split(',').map(Number);
    const result = await this.lockerRepository.find({
      where: { locker_id: In(lockerIds) },
      relations: ['location', 'department'],
    });
    return result;
  }

  async findDept(id: Department | number | string) {
    const result = await this.lockerRepository.findOne({
      where: { locker_id: id },
      relations: ['department'],
    });
    if (result) {
      return result.department;
    }
  }

  async findLocker(id: number | Locker) {
    const result = await this.lockerRepository.findOne({
      where: { locker_id: id },
      relations: ['department'],
    });
    return result;
  }

  async getLockersByDepartment(departmentId: number): Promise<Locker[]> {
    const result = await this.lockerRepository
      .createQueryBuilder('locker')
      .innerJoin('locker.department', 'department')
      .where(`status = 'registered' AND department.id = :departmentId`, {
        departmentId,
      })
      .getMany();
    return result;
  }

  async viewRepair() {
    const result = await this.lockerRepository
      .createQueryBuilder('repair')
      .innerJoinAndSelect('repair.equipment', 'equipment')
      .where('equipment.status = :status', { status: '???????????????????????????????????????????????????' })
      .getMany();
    return getResponse('00', result);
  }

  async getUnRegisterLocker() {
    const result = await this.lockerRepository.find({
      where: {
        status: 'unregister',
      },
    });
    return getResponse('00', result);
  }

  // async viewLocker(user: any) {
  //   console.log('user', user);
  //   if(user.role.role == 'super_admin') {
  //     const result = await this.lockerRepository.find({
  //       relations: ['department']
  //     })
  //     console.log('result', result);
  //   } else if(user.role.role == 'admin') {
  //     const result = await this.lockerRepository.find({
  //       relations:['department'],
  //       where:{
  //         department: user.department
  //       }
  //     });
  //     console.log('result', result);
  //   }
  // }
}
