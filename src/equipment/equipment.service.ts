import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LockersService } from 'src/lockers/lockers.service';
import { TypeEquipmentService } from 'src/type-equipment/type-equipment.service';
import { UsersService } from 'src/users/users.service';
import { getResponse } from 'src/utils/response';
import { Repository } from 'typeorm';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
    private readonly usersService: UsersService,
    private readonly lockersServicer: LockersService,
    private readonly typeEquipService: TypeEquipmentService,
  ) { }
  async create( createEquipmentDto: CreateEquipmentDto[], actor) {
    let user = await this.usersService.findByEmail(actor);
    for (let i = 0; i < createEquipmentDto.length; i++) {
      if(createEquipmentDto[i].type == null && createEquipmentDto[i].duration == null) {
        throw new HttpException(getResponse('25', null), HttpStatus.FORBIDDEN);
      }
      let equip = this.equipmentRepository.create({
        ...createEquipmentDto[i],
        created_by: user,
        updated_by: user,
      });
      await this.equipmentRepository.save(equip);
    }
    return getResponse('00', null);
  }

  async findAll() {
    const result = await this.equipmentRepository.find();
    return getResponse('00', result);
  }

  async find(id: string) {
    let equipmentIds = id.split(',').map(Number);
    let result = await this.equipmentRepository.findByIds(equipmentIds,
      {
        relations: ['locker', 'type', 'created_by', 'updated_by']
      });
    if (equipmentIds.length == result.length) {
      return getResponse('00', result);
    } else {
      throw new HttpException(getResponse('26', null), HttpStatus.FORBIDDEN);
    }
  }

  async update(id: number, updateEquipmentDto: UpdateEquipmentDto, actor) {
    const user = await this.usersService.findByEmail(actor);
    await this.equipmentRepository.update(id, { ...updateEquipmentDto, updated_by: user});
    const result = await this.findOne(id);
    if(result){
      return getResponse('00', result);
    }
    throw new HttpException(getResponse('26', null), HttpStatus.FORBIDDEN);
  }

  async remove(id: number) {
    await this.equipmentRepository.delete(id);
    return getResponse('00', null);
  }

  async findOne(id: number) {
    const result = await this.equipmentRepository.findOne(id) 
    return result;
  }

  async updateStatus(id: number, status: string, actor: any){
    await this.equipmentRepository.update(id, {status: status, updated_by: actor});
  }
}
