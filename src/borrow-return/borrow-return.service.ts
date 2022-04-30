import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EquipmentService } from 'src/equipment/equipment.service';
import { GroupBorrowService } from 'src/group-borrow/group-borrow.service';
import { UsersService } from 'src/users/users.service';
import { getResponse } from 'src/utils/response';
import { Repository } from 'typeorm';
import { CreateBorrowReturnDto } from './dto/create-borrow-return.dto';
import { ReturnDto } from './dto/return.dto';
import { UpdateBorrowReturnDto } from './dto/update-borrow-return.dto';
import { BorrowReturn } from './entities/borrow-return.entity';

@Injectable()
export class BorrowReturnService {
  constructor(
    @InjectRepository(BorrowReturn)
    private borrowReturnRepo: Repository<BorrowReturn>,
    private readonly groupBorrow: GroupBorrowService,
    private readonly equipmentService: EquipmentService,
    private readonly usersService: UsersService,
  ) { }

  async borrow(createBorrowRetunDto: CreateBorrowReturnDto) {
    //let equipmentIds = ids.split(',').map(Number);
    const today = new Date();
    let equip = await this.equipmentService.findByTagIds(createBorrowRetunDto.tag_ids);
    // console.log('equip: ', equip);
    const groupId = await this.groupBorrow.create();
    for (let i = 0; i < equip.length; i++) {
      let deadline = new Date();
      let duration = equip[i].duration;
      if (equip[i].duration == null) {
        duration = equip[i].type.duration;
      }
      // console.log('duration: ', duration);
      deadline.setDate(deadline.getDate() + duration);
      let borrow = this.borrowReturnRepo.create({
        borrowed_at: today,
        deadline_at: deadline,
        groupBorrow: groupId,
        equipment: equip[i],
        user: createBorrowRetunDto.userId,
        status: 'ยืมอยู่'
      });
      await this.borrowReturnRepo.save(borrow);
      await this.equipmentService.updateStatus(equip[i].equipment_id, 'ยืมอยู่', createBorrowRetunDto.userId);
    };
    return getResponse('00', groupId);
  }

  async return(groupId: number) {
    const today = new Date()
    const date = new Date();
    const borrows = await this.borrowReturnRepo.find({
      where: {
        groupBorrow: groupId,
        status: 'ยืมอยู่'
      },
      relations: ['equipment']
    })
    console.log('transacton: ', borrows);
    for (let i = 0; i < borrows.length; i++) {
      if (today <= borrows[i].deadline_at) {
        await this.borrowReturnRepo.update(borrows[i].id, { return_at: date, status: 'คืนแล้ว' });
      } else {
        await this.borrowReturnRepo.update(borrows[i].id, { return_at: date, status: 'ล่าช้า' });
      }
      await this.equipmentService.updateStatus(borrows[i].equipment.equipment_id, 'พร้อมใช้งาน', borrows[i].user);
    };
    return getResponse('00', null);
  }

  async findGroupByUserId(userId: number) {
    const result = await this.borrowReturnRepo.findOne({
      where: {
        user: userId,
        status: 'ยืมอยู่'
      },
      relations: ['groupBorrow']
    })
    return getResponse('00', result.groupBorrow);
  }

  // async findAll(user: any) {
  //   const result = await this.borrowReturnRepo.find({
  //     relations: ['equipment'],
  //     where: {
  //       user: user.id
  //     }
  //   })
  //   return result;
  // }

  async findOne(id: number) {
    const result = await this.borrowReturnRepo.findOne(id, {
      relations: ['equipment']
    })
    return result;
  }

  async updateStatus(borrowId: number, status: string) {
    const today = new Date();
    let result;
    if (status == 'คืนแล้ว') {
      result = await this.borrowReturnRepo.update(borrowId, {
        status: status,
        return_at: today
      });
    } else {
      result = await this.borrowReturnRepo.update(borrowId, {
        status: status,
      });
    }
    return getResponse('00', result);
  }

  async remove(id: number) {
    await this.borrowReturnRepo.delete(id)
    return getResponse('00', null);
  }

  async viewHistory(equipment: number) {
    const result = await this.borrowReturnRepo.find({
      relations: ['user'],
      where: {
        equipment: equipment
      }
    })
    return getResponse('00', result);
  }

  async viewByGroupId(groupId: number) {
    const result = await this.borrowReturnRepo.find({
      relations: ['equipment', 'groupBorrow'],
      where: {
        groupBorrow: groupId
      }
    })
    return getResponse('00', result);
  }
}
