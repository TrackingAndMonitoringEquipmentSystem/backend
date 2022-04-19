import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getResponse } from 'src/utils/response';
import { getRepository, Repository } from 'typeorm';
import { CreateGroupRepairDto } from './dto/create-group-repair.dto';
import { UpdateGroupRepairDto } from './dto/update-group-repair.dto';
import { GroupRepair } from './entities/group-repair.entity';

@Injectable()
export class GroupRepairService {
  constructor(
    @InjectRepository(GroupRepair)
    private groupRepairRepo: Repository<GroupRepair>,
  ) { }

  async create() {
    let group = this.groupRepairRepo.create({
      status: 'รับเรื่องแจ้งซ่อม',
    })
    await this.groupRepairRepo.save(group);
    return group;
  }

  async findAll() {
    let result = await this.groupRepairRepo.find();
    return getResponse('00', result);
  }

  async findRepairList() {
    let result = await this.groupRepairRepo.find({
      where: {
        status: 'รับเรื่องแจ้งซ่อม'
      },
      relations: ['repairs']
    })
    return getResponse('00', result);
  }

  findOne(id: number) {
    return `This action returns a #${id} groupRepair`;
  }

  async update(id: number, status: string) {
    await this.groupRepairRepo.update(id, { status: status });
  }

  remove(id: number) {
    return `This action removes a #${id} groupRepair`;
  }

  async viewHistory(equipmentId: number) {
    const result = await this.groupRepairRepo.createQueryBuilder('groupRepair')
      .innerJoinAndSelect('groupRepair.repairs', 'repairs')
      .innerJoin('repairs.equipment', 'equipment')
      .where('equipment.equipment_id = :equipmentId', { equipmentId })
      .getMany()
    return result;
  }
}
