import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentService } from 'src/department/department.service';
import { LockersService } from 'src/lockers/lockers.service';
import { getResponse } from 'src/utils/response';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateTemporaryDeptDto } from './dto/create-temporary-dept.dto';
import { UpdateTemporaryDeptDto } from './dto/update-temporary-dept.dto';
import { TemporaryDept } from './entities/temporary-dept.entity';

@Injectable()
export class TemporaryDeptService {
  constructor(
    @InjectRepository(TemporaryDept)
    private tempDeptRepository: Repository<TemporaryDept>,
    @Inject(forwardRef(() => LockersService))
    private readonly lockerService: LockersService,
    private readonly departmentService: DepartmentService,
  ) {}

  async create(locker: any, createTemporaryDeptDto: CreateTemporaryDeptDto) {
    const lockerInfo = await this.lockerService.findLocker(locker);
    const dept = await this.departmentService.findOne(
      createTemporaryDeptDto.department,
    );
    if (dept) {
      const lockerDept = await this.lockerService.findDept(
        lockerInfo.locker_id,
      );
      for (let i = 0; i < lockerDept.length; i++) {
        if (lockerDept[i].id == Number(createTemporaryDeptDto.department)) {
          throw new HttpException(
            getResponse('14', null),
            HttpStatus.FORBIDDEN,
          );
        }
      }
      const tempDept = this.tempDeptRepository.create({
        start_date: createTemporaryDeptDto.start_date,
        end_date: createTemporaryDeptDto.end_date,
        department: dept,
        locker: lockerInfo,
      });
      await this.tempDeptRepository.save(tempDept);
      return getResponse('00', null);
    }
    throw new HttpException(getResponse('15', null), HttpStatus.FORBIDDEN);
  }

  async findAll(lockerId: number) {
    const result = await this.tempDeptRepository.find({
      where: {
        locker: lockerId,
      },
      relations: ['locker', 'department'],
    });
    return getResponse('00', result);
  }

  async findOne(lockerId: number, deptId: number) {
    const result = await this.tempDeptRepository.findOne({
      relations: ['locker', 'department'],
      where: {
        locker: lockerId,
        department: deptId,
      },
    });
    if (result) {
      return getResponse('00', result);
    }

    throw new HttpException(getResponse('16', null), HttpStatus.FORBIDDEN);
  }

  async update(
    lockerId: number,
    deptId: number,
    updateTemporaryDeptDto: UpdateTemporaryDeptDto,
  ) {
    const lockerInfo = await this.lockerService.findLocker(lockerId);
    const dept = await this.departmentService.findOne(deptId);
    if (lockerInfo && dept) {
      await this.tempDeptRepository.update(
        { locker: lockerInfo, department: dept },
        { ...updateTemporaryDeptDto },
      );
      return this.findOne(lockerId, deptId);
    }

    throw new HttpException(getResponse('16', null), HttpStatus.FORBIDDEN);
  }

  async remove(lockerId: number, deptId: number) {
    const result = await this.tempDeptRepository.findOne({
      relations: ['locker', 'department'],
      where: {
        locker: lockerId,
        department: deptId,
      },
    });
    if (result) {
      await this.tempDeptRepository.remove(result);
      return getResponse('00', null);
    }
    throw new HttpException(getResponse('16', null), HttpStatus.FORBIDDEN);
  }

  async findTempDept(lockerId: string, deptId: number) {
    const date = new Date();
    const result = await this.tempDeptRepository.findOne({
      relations: ['locker', 'department'],
      where: {
        locker: lockerId,
        department: deptId,
        start_date: LessThanOrEqual(date),
        end_date: MoreThanOrEqual(date),
      },
    });
    return result;
  }
}
