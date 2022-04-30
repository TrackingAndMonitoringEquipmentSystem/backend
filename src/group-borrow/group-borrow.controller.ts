import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { GroupBorrowService } from './group-borrow.service';
import { CreateGroupBorrowDto } from './dto/create-group-borrow.dto';
import { UpdateGroupBorrowDto } from './dto/update-group-borrow.dto';
import { RolesAndDeptGuard } from 'src/utils/guard/rolesAndDept.guard';
import { Roles } from 'src/utils/guard/roles.decorator';

@Controller('group-borrow')
export class GroupBorrowController {
  constructor(private readonly groupBorrowService: GroupBorrowService) { }


  // @Post()
  // create(@Body() createGroupBorrowDto: CreateGroupBorrowDto) {
  //   return this.groupBorrowService.create(createGroupBorrowDto);
  // }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin', 'master_maintainer', 'maintainer', 'user')
  @Get()
  findAll(@Request() req) {
    return this.groupBorrowService.findAll(req.user);
  }

  @Get('viewGroup/:userId')
  viewGroup(@Param('userId') id: number) {
    return this.groupBorrowService.viewGroup(id);
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.groupBorrowService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGroupBorrowDto: UpdateGroupBorrowDto) {
  //   return this.groupBorrowService.update(+id, updateGroupBorrowDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.groupBorrowService.remove(+id);
  // }
}
