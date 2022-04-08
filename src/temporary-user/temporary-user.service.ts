import { forwardRef, HttpException, HttpService, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LockersService } from 'src/lockers/lockers.service';
import { UsersService } from 'src/users/users.service';
import { getResponse } from 'src/utils/response';
import { LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateTemporaryUserDto } from './dto/create-temporary-user.dto';
import { UpdateTemporaryUserDto } from './dto/update-temporary-user.dto';
import { TemporaryUser } from './entities/temporary-user.entity';

@Injectable()
export class TemporaryUserService {
  constructor(
    @InjectRepository(TemporaryUser)
    private tempUserRepository: Repository<TemporaryUser>,
    @Inject(forwardRef(() => LockersService))
    private readonly lockersService: LockersService,
    private readonly usersService: UsersService,
  ) { }
  async create(lockerId: number, createTemporaryUserDto: CreateTemporaryUserDto) {
    let lockerInfo = await this.lockersService.findLocker(lockerId);
    let userInfo = await this.usersService.findById(Number(createTemporaryUserDto.user));
    if (userInfo) {
      let lockerDept = await this.lockersService.findDept(lockerInfo.locker_id);
      console.log('test', lockerDept);
      for (let i = 0; i < lockerDept.length; i++) {
        console.log('gh',userInfo.dept);
        if (lockerDept[i].id == userInfo.dept.id) {
          throw new HttpException(getResponse('17', null), HttpStatus.FORBIDDEN);
        }
      }
       let tempDept = this.tempUserRepository.create({
         start_date: createTemporaryUserDto.start_date,
         end_date: createTemporaryUserDto.end_date,
         user: userInfo,
         locker: lockerInfo
       });
       await this.tempUserRepository.save(tempDept);
      return getResponse('00', null);
    }
    throw new HttpException(getResponse('18', null), HttpStatus.FORBIDDEN);
  }

  async findAll(lockerId: number) {
    let result = await this.tempUserRepository.find({
      where: {
        locker: lockerId
      }
    });
    return getResponse('00', result);
  }

  async findOne(lockerId: number, userId: number) {
    let result = await this.tempUserRepository.findOne({
      relations: ['locker', 'user'],
      where: {
        locker: lockerId,
        user: userId,
      }
    });
    if (result) {
      return getResponse('00', result);
    }
    throw new HttpException(getResponse('21', null), HttpStatus.FORBIDDEN);
  }

  async update(lockerId: number, userId: number, updateTemporaryUserDto: UpdateTemporaryUserDto) {
    let lockerInfo = await this.lockersService.findLocker(lockerId);
    let userInfo = await this.usersService.findById(userId);
    if (lockerInfo && userInfo) {
      await this.tempUserRepository.update({ locker: lockerInfo, user: userInfo }, { ...updateTemporaryUserDto })
      return this.findOne(lockerId, userId);
    }

    throw new HttpException(getResponse('21', null), HttpStatus.FORBIDDEN);
  }

  async remove(lockerId: number, userId: number) {
    let result = await this.tempUserRepository.findOne({
      relations: ['locker', 'user'],
      where: {
        locker: lockerId,
        user: userId,
      }
    });
    if (result) {
      await this.tempUserRepository.remove(result);
      return getResponse('00', result);
    }
    throw new HttpException(getResponse('21', null), HttpStatus.FORBIDDEN);
  }

  async findtempUser(lockerId: string, userId: number) {
    const date = new Date();
    let result = await this.tempUserRepository.findOne({
      relations: ['locker', 'user'],
      where: {
        locker: lockerId,
        user: userId,
        start_date: LessThanOrEqual(date),
        end_date: MoreThanOrEqual(date),
      }
    });
    return result;
  }
}
