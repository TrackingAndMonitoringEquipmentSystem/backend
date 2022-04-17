import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getResponse } from 'src/utils/response';
import { Repository } from 'typeorm';
import { CreateTypeEquipmentDto } from './dto/create-type-equipment.dto';
import { UpdateTypeEquipmentDto } from './dto/update-type-equipment.dto';
import { TypeEquipment } from './entities/type-equipment.entity';

@Injectable()
export class TypeEquipmentService {
  constructor(
    @InjectRepository(TypeEquipment)
    private typeEquipRepo: Repository<TypeEquipment>,
  ) {}
  async create( createTypeEquipmentDto: CreateTypeEquipmentDto) {
    const result = await this.typeEquipRepo.findOne({
      where: {
        name: createTypeEquipmentDto.name
      }
    });
    if(result == null) {
      throw new HttpException(getResponse('23', null), HttpStatus.FORBIDDEN);
    } else {
      const typeEquip = this.typeEquipRepo.create(createTypeEquipmentDto);
      await this.typeEquipRepo.save(typeEquip);
      return getResponse('00', null);
    }
  }

  async findAll() {
    const result = await this.typeEquipRepo.find();
    return getResponse('00', result);
  }

  async findOne(id: number) {
    const result = await this.typeEquipRepo.findOne({
      where: {
        id: id
      }
    });
    if(result) {
      return getResponse('00', result);
    }
    throw new HttpException(getResponse('24', null), HttpStatus.FORBIDDEN);
  }

  async update(id: number, updateTypeEquipmentDto: UpdateTypeEquipmentDto) {
    await this.typeEquipRepo.update(id, {...updateTypeEquipmentDto})
    const result = await this.typeEquipRepo.findOne({
      where: {
        id: id
      }
    });
    if(result) {
      return getResponse('00', result);
    }
    throw new HttpException(getResponse('22', null), HttpStatus.FORBIDDEN);
  }

   remove(id: number) {
    this.typeEquipRepo.delete(id); 
    return getResponse('00', null);
  }

  async findType(typeId: number | TypeEquipment) {
    const result = await this.typeEquipRepo.findOne({
      where: {
        id: typeId
      }
    });
    return result;
  }


}
