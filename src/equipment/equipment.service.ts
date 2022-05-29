import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileAssetsService } from 'src/file-assets/file-assets.service';
import { LockerGateway } from 'src/lockers/locker.gateway';
import { UsersService } from 'src/users/users.service';
import { getResponse, ResponseDto } from 'src/utils/response';
import { In, QueryFailedError, Repository } from 'typeorm';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { SaveEquipmentsRequestDto } from './dto/save-equipments-request.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
    private readonly usersService: UsersService,
    private readonly lockerGateway: LockerGateway,
    private readonly fileAssetsService: FileAssetsService,
  ) {}
  async create(createEquipmentDto: CreateEquipmentDto[], actor) {
    const user = await this.usersService.findByEmail(actor);
    const equipmentResponses = [];
    for (let i = 0; i < createEquipmentDto.length; i++) {
      if (
        createEquipmentDto[i].type == null &&
        createEquipmentDto[i].duration == null
      ) {
        throw new HttpException(getResponse('25', null), HttpStatus.FORBIDDEN);
      }
      try {
        const equip = this.equipmentRepository.create({
          ...createEquipmentDto[i],
          created_by: user,
          updated_by: user,
        });
        equipmentResponses.push(await this.equipmentRepository.save(equip));
      } catch (error) {
        if (error instanceof QueryFailedError) {
          const queryError = error as QueryFailedError;
          console.log(
            '->queryError.driverError.code:',
            queryError.driverError.code,
          );
          if (
            queryError.name === 'QueryFailedError' &&
            queryError.driverError.code == 'ER_DUP_ENTRY'
          ) {
            return getResponse('30', null);
          }
          return getResponse('99', null);
        }

        return getResponse('99', null);
      }
    }
    return getResponse('00', equipmentResponses);
  }

  async findAll(user: any) {
    if (user.role.role == 'super_admin') {
      const result = await this.equipmentRepository.find({
        relations: ['type', 'locker', 'created_by', 'updated_by'],
      });
      return getResponse('00', result);
    } else if (user.role.role == 'admin') {
      const departmentId = user.dept.id;
      let result = await this.equipmentRepository
        .createQueryBuilder('equipment')
        .innerJoinAndSelect('equipment.locker', 'locker')
        .innerJoinAndSelect('equipment.type', 'type')
        .innerJoinAndSelect('equipment.created_by', 'created_by')
        .innerJoinAndSelect('equipment.updated_by', 'updated_by')
        .innerJoin('locker.department', 'department')
        .where('department.id = :departmentId', { departmentId })
        .getMany();
      let equipNoType = await this.equipmentRepository
        .createQueryBuilder('equipment')
        .innerJoinAndSelect('equipment.locker', 'locker')
        .innerJoinAndSelect('equipment.created_by', 'created_by')
        .innerJoinAndSelect('equipment.updated_by', 'updated_by')
        .innerJoin('locker.department', 'department')
        .where('department.id = :departmentId', { departmentId })
        .andWhere('equipment.type IS NULL')
        .getMany();
      result = result.concat(equipNoType);
      return getResponse('00', result);
    }
  }

  async find(id: string) {
    const equipmentIds = id.split(',').map(Number);
    const result = await this.equipmentRepository.findByIds(equipmentIds, {
      relations: ['locker', 'type', 'created_by', 'updated_by'],
    });
    if (equipmentIds.length == result.length) {
      return getResponse('00', result);
    } else {
      throw new HttpException(getResponse('26', null), HttpStatus.FORBIDDEN);
    }
  }

  async findByTagIds(tag_ids: any) {
    const result = await this.equipmentRepository.find({
      where: {
        tag_id: In(tag_ids),
      },
      relations: ['type'],
    });
    if (result.length == tag_ids.length) {
      return result;
    } else {
      throw new HttpException(getResponse('31', null), HttpStatus.FORBIDDEN);
    }
  }

  async update(id: number, updateEquipmentDto: UpdateEquipmentDto, actor) {
    const user = await this.usersService.findByEmail(actor);
    await this.equipmentRepository.update(id, {
      ...updateEquipmentDto,
      updated_by: user,
    });
    const result = await this.findOne(id);
    if (result) {
      return getResponse('00', result);
    }
    throw new HttpException(getResponse('26', null), HttpStatus.FORBIDDEN);
  }

  async remove(id: number) {
    await this.equipmentRepository.delete(id);
    return getResponse('00', null);
  }

  async findOne(id: number) {
    const result = await this.equipmentRepository.findOne(id);
    return result;
  }

  async updateStatus(id: number, status: string, actor: any) {
    await this.equipmentRepository.update(id, {
      status: status,
      updated_by: actor,
    });
  }

  async findEquipmentNoType() {
    const result = await this.equipmentRepository.find({
      relations: [
        'locker',
        'locker.room',
        'locker.room.floor',
        'locker.room.floor.building',
      ],
      where: {
        type: null,
      },
    });
    return result;
  }

  async viewAll(user: any) {
    const departmentId = user.dept.id;
    const result = await this.equipmentRepository
      .createQueryBuilder('equipment')
      .addSelect('COUNT(equipment.equipment_id) AS Count')
      .innerJoinAndSelect('equipment.locker', 'locker')
      .innerJoinAndSelect('equipment.type', 'type')
      .innerJoin('locker.department', 'department')
      .where('department.id = :departmentId', { departmentId })
      .groupBy('equipment.type')
      .addGroupBy('equipment.status')
      .getMany();
    return getResponse('00', result);
  }

  async viewRepair() {
    const result = await this.equipmentRepository.find({
      where: {
        status: 'รับเรื่องแจ้งซ่อม',
      },
      relations: ['repairs'],
    });
    return getResponse('00', result);
  }

  async groupEquipNoType(user: any) {
    const departmentId = user.dept.id;
    const equipment = await this.equipmentRepository
      .createQueryBuilder('equipment')
      .innerJoin('equipment.locker', 'locker')
      .innerJoin('locker.department', 'department')
      .where('department.id = :departmentId', { departmentId })
      .andWhere('typeId IS NULL')
      .groupBy('equipment.status')
      .select(['equipment.status', 'equipment_id', 'equipment.equip_pic'])
      .addSelect('COUNT(equipment_id) AS count_equipment')
      .getRawMany();
    for (const i in equipment) {
      (equipment[i].type_id = null),
        (equipment[i].type_name = 'อุปกรณ์ทั่วไป'),
        (equipment[i].type_duraion = null);
    }
    return equipment;
  }

  async saveEquipments(
    saveEquipmentsRequestDto: SaveEquipmentsRequestDto,
    email: string,
  ): Promise<ResponseDto> {
    const createEquipmentDtos = [];
    const macAddresses: string[] = [];

    saveEquipmentsRequestDto.equipments.forEach((equipment) => {
      macAddresses.push(equipment.macAddress);
      createEquipmentDtos.push({
        name: equipment.name,
        tag_id: equipment.macAddress,
        status: 'พร้อมใช้งาน',
        equip_pic: this.fileAssetsService.saveImage(equipment.base64Image),
        duration: equipment.duration,
        type: { id: equipment.typeId },
        locker: { locker_id: saveEquipmentsRequestDto.lockerId },
      } as CreateEquipmentDto);
    });

    const result = await this.create(createEquipmentDtos, email);
    console.log('->result:', result);
    if (result.successful) {
      this.lockerGateway.saveEquipment(
        saveEquipmentsRequestDto.lockerId,
        saveEquipmentsRequestDto.uuid,
        macAddresses,
      );
      return getResponse('00', result.data);
    } else {
      if (result.errorCode === '30') {
        throw new HttpException(
          { message: result.message },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw result;
    }
  }
}
