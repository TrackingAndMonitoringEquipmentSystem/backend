import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupBorrowService } from './group-borrow.service';
import { CreateGroupBorrowDto } from './dto/create-group-borrow.dto';
import { UpdateGroupBorrowDto } from './dto/update-group-borrow.dto';

@Controller('group-borrow')
export class GroupBorrowController {
  constructor(private readonly groupBorrowService: GroupBorrowService) {}

  /*@Post()
  create(@Body() createGroupBorrowDto: CreateGroupBorrowDto) {
    return this.groupBorrowService.create(createGroupBorrowDto);
  }

  @Get()
  findAll() {
    return this.groupBorrowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupBorrowService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupBorrowDto: UpdateGroupBorrowDto) {
    return this.groupBorrowService.update(+id, updateGroupBorrowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupBorrowService.remove(+id);
  }*/
}
