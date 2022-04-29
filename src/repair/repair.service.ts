import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EquipmentService } from 'src/equipment/equipment.service';
import { GroupRepairService } from 'src/group-repair/group-repair.service';
import { getResponse } from 'src/utils/response';
import { Repository } from 'typeorm';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { Repair } from './entities/repair.entity';

@Injectable()
export class RepairService {
  constructor(
    @InjectRepository(Repair)
    private repairRepository: Repository<Repair>,
    private readonly equipmentService: EquipmentService,
    private readonly groupRepairService: GroupRepairService,
  ) { }

  async create(id: number, createRepairDto: CreateRepairDto, actor: any) {
    const today = new Date();
    let equip = await this.equipmentService.findOne(id);
    if (equip != null) {
      let repair = this.repairRepository.create({
        requested_at: today,
        description: createRepairDto.description,
        status: 'ร้องขอแจ้งซ่อม',
        user: actor,
        equipment: equip
      })
      await this.repairRepository.save(repair);
      return getResponse('00', null);
    } else {
      throw new HttpException(getResponse('28', null), HttpStatus.FORBIDDEN);
    }
  }

  async find() {
    let result = await this.repairRepository.find();
    return getResponse('00', result);
  }

  async findRepair(ids: string) {
    let repairIds = ids.split(',').map(Number);
    let result = await this.repairRepository.findByIds(repairIds, {
      relations: ['equipment']
    });
    return getResponse('00', result);
  }

  // update(id: number, updateRepairDto: UpdateRepairDto) {
  //   return `This action updates a #${id} repair`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} repair`;
  // }

  async findReportByEquipId(id: number) {
    let result = await this.repairRepository.find({
      relations: ['equipment'],
      where: {
        equipment: id,
        status: 'ร้องขอแจ้งซ่อม'
      }
    });
    return getResponse('00', result);
  }

  async sendRequest(ids: string, actor: any) {
    const today = new Date();
    const group = await this.groupRepairService.create();
    let repairIds = ids.split(',').map(Number);
    for (let i = 0; i < repairIds.length; i++) {
      await this.repairRepository.update(repairIds[i], {
        approved_at: today,
        status: 'รับเรื่องแจ้งซ่อม',
        groupRepair: group,
      })
    }
    let repair = await this.repairRepository.findOne(repairIds[0], {
      relations: ['equipment'],
    });
    await this.equipmentService.updateStatus(repair.equipment.equipment_id, 'ส่งซ่อม', actor);
    return getResponse('00', null);
  }

  async cancelRequest(ids: string) {
    let repairIds = ids.split(',').map(Number);
    for (let i = 0; i < repairIds.length; i++) {
      await this.repairRepository.update(repairIds[i], {
        status: 'ยกเลิก',
      })
    }
    return getResponse('00', null);
  }

  async repair(id: number, maintainer: any) {
    const today = new Date();
    let repairList = await this.repairRepository.find({
      where: {
        groupRepair: id
      }
    })
    for (let i = 0; i < repairList.length; i++) {
      await this.repairRepository.update(repairList[i].id, {
        status: 'กำลังดำเนินการ',
        maintainer_id: maintainer,
        repair_at: today
      })
    }
    await this.groupRepairService.update(id, 'กำลังดำเนินการ');
    return getResponse('00', null);
  }

  async finishRepair(id: number, maintainer: any) {
    const today = new Date();
    let repairList = await this.repairRepository.find({
      where: {
        groupRepair: id
      },
      relations: ['equipment']
    })
    for (let i = 0; i < repairList.length; i++) {
      await this.repairRepository.update(repairList[i].id, {
        status: 'ดำเนินการเสร็จสิ้น',
        finished_at: today
      })
    }
    await this.groupRepairService.update(id, 'ดำเนินการเสร็จสิ้น');
    await this.equipmentService.updateStatus(repairList[0].equipment.equipment_id, 'พร้อมใช้งาน', maintainer);
    return getResponse('00', null);
  }
  /*async findRepairList() {
    let result = await this.repairRepository.find({
      where: {
        status: 'รับเรื่องแจ้งซ่อม'
      }
    })
    return getResponse('00', result)
  }*/

  // async viewHistory(equipmentId: number) {
  //   const result = await this.repairRepository.find({
  //     where: {
  //       equipment: equipmentId
  //     }
  //   });
  //   return result;
  // }
}
