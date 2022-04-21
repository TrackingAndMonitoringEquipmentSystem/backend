import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { RolesAndDeptGuard } from 'src/utils/guard/rolesAndDept.guard';
import { Roles } from 'src/utils/guard/roles.decorator';


@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) { }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin')
  @Post()
  create(@Request() req, @Body() createEquipmentDto: CreateEquipmentDto[]) {
    return this.equipmentService.create(createEquipmentDto, req.actor);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin', 'master_maintainer', 'maintainer', 'user')
  @Get()
  findAll(@Request() req,) {
    return this.equipmentService.viewAll(req.user);
  }

  @Get('viewByEquipmentId/:id')
  findOne(@Param('id') id: string) {
    return this.equipmentService.find(id);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin')
  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateEquipmentDto: UpdateEquipmentDto) {
    return this.equipmentService.update(+id, updateEquipmentDto, req.actor);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(+id);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('master_maintainer', 'maintainer')
  @Get('viewRepair')
  viewRepair() {
    return this.equipmentService.viewRepair();
  }
}
