import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GroupRepairService } from './group-repair.service';
import { CreateGroupRepairDto } from './dto/create-group-repair.dto';
import { UpdateGroupRepairDto } from './dto/update-group-repair.dto';
import { Roles } from 'src/utils/guard/roles.decorator';
import { RolesAndDeptGuard } from 'src/utils/guard/rolesAndDept.guard';


@Controller('repair')
export class GroupRepairController {
  constructor(private readonly groupRepairService: GroupRepairService) {}

  @UseGuards(RolesAndDeptGuard)
  @Roles('master_maintainer', 'maintainer')
  @Get('getRepairList')
  requestRepairList() {
    return this.groupRepairService.findRepairList();
  }
  
  /*@Post()
  create(@Body() createGroupRepairDto: CreateGroupRepairDto) {
    return this.groupRepairService.create(createGroupRepairDto);
  }

  @Get()
  findAll() {
    return this.groupRepairService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupRepairService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupRepairDto: UpdateGroupRepairDto) {
    return this.groupRepairService.update(+id, updateGroupRepairDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupRepairService.remove(+id);
  }*/
}
