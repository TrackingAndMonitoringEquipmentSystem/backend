import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EquipmentService } from 'src/equipment/equipment.service';
import { GroupBorrowService } from 'src/group-borrow/group-borrow.service';
import { UsersService } from 'src/users/users.service';
import { getResponse } from 'src/utils/response';
import { Repository } from 'typeorm';
import { CreateBorrowReturnDto } from './dto/create-borrow-return.dto';
import { UpdateBorrowReturnDto } from './dto/update-borrow-return.dto';
import { BorrowReturn } from './entities/borrow-return.entity';

@Injectable()
export class BorrowReturnService 
{
  constructor(
    @InjectRepository(BorrowReturn)
    private borrowReturnRepo : Repository<BorrowReturn>,
    private readonly groupBorrow: GroupBorrowService,
    private readonly equipmentService: EquipmentService,
    private readonly usersService : UsersService,
  ) {}
  
  async borrow(ids: string, actor) {
    //let equipmentIds = ids.split(',').map(Number);
    const today = new Date();
    let equip = await this.equipmentService.find(ids);
    const groupId = await this.groupBorrow.create();
    for(let i = 0; i < equip.data.length; i++) {
      let deadline = new Date();
      let duration = equip.data[i].duration;
      if(equip.data[i].duration == null)  {
        duration = equip.data[i].type.duration;
      }
      deadline.setDate(deadline.getDate() + duration);
      let borrow = this.borrowReturnRepo.create({
        borrowed_at: today,
        deadline_at: deadline,
        groupBorrow: groupId,
        equipment: equip.data[i],
        user: actor,
      });
      await this.borrowReturnRepo.save(borrow); 
      await this.equipmentService.updateStatus(equip.data[i].equipment_id, 'ถูกยืมอยู่', actor);
    };
    return getResponse('00', null);
  }

  async return(ids: string, actor: any) {
    let transactionIds = ids.split(',').map(Number);
    const date = new Date();
    for(let i = 0; i< transactionIds.length; i++){
      let borrow = await this.borrowReturnRepo.findOne({
        where : {
          id: transactionIds[i]
        },
        relations: ['equipment', 'user']
      });
      //console.log('actor',actor);
      await this.borrowReturnRepo.update(borrow.id, {return_at: date});
      await this.equipmentService.updateStatus(borrow.equipment.equipment_id,  'พร้อมใช้งาน', actor);
    };
    return getResponse('00', null);
  }

  findAll() {
    return `This action returns all borrowReturn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} borrowReturn`;
  }

  update(id: number, updateBorrowReturnDto: UpdateBorrowReturnDto) {
    return `This action updates a #${id} borrowReturn`;
  }

  remove(id: number) {
    return `This action removes a #${id} borrowReturn`;
  }
}
