import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { EquipmentService } from 'src/equipment/equipment.service';
import { getResponse } from 'src/utils/response';
import { createQueryBuilder, Repository } from 'typeorm';
import { CreateTypeEquipmentDto } from './dto/create-type-equipment.dto';
import { UpdateTypeEquipmentDto } from './dto/update-type-equipment.dto';
import { TypeEquipment } from './entities/type-equipment.entity';

@Injectable()
export class TypeEquipmentService {
  constructor(
    @InjectRepository(TypeEquipment)
    private typeEquipRepo: Repository<TypeEquipment>,
    private readonly equipmentService: EquipmentService,
  ) { }
  async create(createTypeEquipmentDto: CreateTypeEquipmentDto) {
    const result = await this.typeEquipRepo.findOne({
      where: {
        name: createTypeEquipmentDto.name
      }
    });
    if (result == null) {
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
    if (result) {
      return getResponse('00', result);
    }
    throw new HttpException(getResponse('24', null), HttpStatus.FORBIDDEN);
  }

  async update(id: number, updateTypeEquipmentDto: UpdateTypeEquipmentDto) {
    await this.typeEquipRepo.update(id, { ...updateTypeEquipmentDto })
    const result = await this.typeEquipRepo.findOne({
      where: {
        id: id
      }
    });
    if (result) {
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

  async viewByEquipment(user: any) {
    if (user.role.role == 'super_admin') {
      let equip = await this.typeEquipRepo.find({
        relations: ['equipment', 'equipment.locker', 'equipment.locker.room', 'equipment.locker.room.floor', 'equipment.locker.room.floor.building']
      });
      const equipNoType = { id: null, name: null, duration: null, equipment: await this.equipmentService.findEquipmentNoType() };
      equip.push(equipNoType);
      return equip;
    } else if (user.role.role == 'admin') {
      const departmentId = user.dept.id;

      let equip = await this.typeEquipRepo.createQueryBuilder('type')
        .innerJoinAndSelect('type.equipment', 'equipment')
        .innerJoinAndSelect('equipment.locker', 'locker')
        .innerJoin('locker.department', 'department')
        .innerJoinAndSelect('locker.room', 'room')
        .innerJoinAndSelect('room.floor', 'floor')
        .innerJoinAndSelect('floor.building', 'building')
        .where('department.id = :departmentId', { departmentId })
        .getMany()
      const equipNoType = await createQueryBuilder().select("equipment").from(Equipment, "equipment")
        .innerJoinAndSelect('equipment.locker', 'locker')
        .innerJoin('locker.department', 'department')
        .innerJoinAndSelect('locker.room', 'room')
        .innerJoinAndSelect('room.floor', 'floor')
        .innerJoinAndSelect('floor.building', 'building')
        .where('department.id = :departmentId', { departmentId })
        .where('equipment.typeId IS NULL')
        .getMany()
      equip.push({ id: null, name: null, duration: null, equipment: equipNoType });
      return equip;
    }
  }

  async viewEquipment(user: any) {
    const departmentId = user.dept.id;
    let equipment = await this.typeEquipRepo.createQueryBuilder('type')
      .innerJoin('type.equipment', 'equipment')
      .innerJoin('equipment.locker', 'locker')
      .innerJoin('locker.department', 'department')
      .where('department.id = :departmentId', { departmentId })
      .groupBy('equipment.status')
      .select('type')
      .addSelect('equipment.status')
      .addSelect('equipment.equipment_id')
      .addSelect('equipment.equip_pic')
      .addSelect('COUNT(equipment.equipment_id) AS count_equipment')
      .getRawMany()

    let equipNoType = await this.equipmentService.groupEquipNoType(user);
    for (let i in equipNoType) {
      equipment.push(equipNoType[i]);
    }
    return equipment;
  }


}
