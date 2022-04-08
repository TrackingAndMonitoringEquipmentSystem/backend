import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { UsersService } from 'src/users/users.service';
import { getResponse } from 'src/utils/response';
import { In, Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private deptRepository: Repository<Department>,
    private readonly userService: UsersService
  ) { }

  async create(createDepartmentDto: CreateDepartmentDto, actorId) {
    //let user = await this.userService.findByEmail(actor.email);
    const dept = await this.deptRepository.create({
      dept_name: createDepartmentDto.dept_name,
      created_by: actorId,
      updated_by: actorId,
    })
    const result = await this.deptRepository.save(dept);
    return getResponse('00', result);
  }

  async viewAll() {
    const result = await this.deptRepository.find({
      relations: ['created_by', 'updated_by'],
    });
    return getResponse('00', result);
  }

  async viewDepartment(ids: string) {
    const convertIdsToNum = ids.split(',').map(Number);
    const result = await this.deptRepository.find({
      where: {
        id: In(convertIdsToNum),
      },
      relations: ['created_by', 'updated_by']
    })
    return getResponse('00', result);
  }

  async findDept(ids: Department[]) {
    //const convertIdsToNum = ids.split(',').map(Number);
    const result = await this.deptRepository.find({
      where: {
        id: In(ids),
      }
    })
    return result;
  }


  async update(id: string, updateDepartmentDto: UpdateDepartmentDto, actorId) {
    //console.log('actor', actor.email);
    //let user = await this.userService.findByEmail(actor.email);
    const result = await this.deptRepository.save({
      dept_name: updateDepartmentDto.dept_name,
      id: Number(id),
      updated_by: actorId
    })
    return getResponse('00', result);
  }

  remove(id: number) {
    this.deptRepository.delete(id);
    return getResponse('00', null);
  }

  async findOne(id: number | Department){
    let result = await this.deptRepository.findOne({
      where: {
        id: id
      }
    })
    return result;
  }
}
