import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getResponse } from 'src/utils/response';
import { Repository } from 'typeorm';
import { CreateGroupBorrowDto } from './dto/create-group-borrow.dto';
import { UpdateGroupBorrowDto } from './dto/update-group-borrow.dto';
import { GroupBorrow } from './entities/group-borrow.entity';

@Injectable()
export class GroupBorrowService {
  constructor(
    @InjectRepository(GroupBorrow)
    private groupBorrowRepo: Repository<GroupBorrow>,
  ) { }

  async create(): Promise<GroupBorrow> {
    const group = this.groupBorrowRepo.create();
    await this.groupBorrowRepo.save(group);
    return group;
  }

  async findAll(user: any) {
    const userId = user.id;
    const result = await this.groupBorrowRepo.createQueryBuilder('group')
      .innerJoinAndSelect('group.borrowReturns', 'borrowReturns')
      .innerJoin('borrowReturns.user', 'user')
      .innerJoinAndSelect('borrowReturns.equipment', 'equipment')
      .where('user.id = :userId', { userId })
      .getMany()
    return getResponse('00', result);
  }

  async findOne(id: number) {
    const result = await this.groupBorrowRepo.findOne(id, {
      relations: ['equipment']
    });
    return getResponse('00', result);
  }

  update(id: number, updateGroupBorrowDto: UpdateGroupBorrowDto) {
    return `This action updates a #${id} groupBorrow`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupBorrow`;
  }
}
