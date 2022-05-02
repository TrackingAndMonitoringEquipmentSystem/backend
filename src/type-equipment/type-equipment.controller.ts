import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TypeEquipmentService } from './type-equipment.service';
import { CreateTypeEquipmentDto } from './dto/create-type-equipment.dto';
import { UpdateTypeEquipmentDto } from './dto/update-type-equipment.dto';
import { RolesAndDeptGuard } from 'src/utils/guard/rolesAndDept.guard';
import { Roles } from 'src/utils/guard/roles.decorator';




@Controller('type-equipment')
export class TypeEquipmentController {
  constructor(private readonly typeEquipmentService: TypeEquipmentService) { }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin')
  @Post()
  create(@Body() createTypeEquipmentDto: CreateTypeEquipmentDto) {
    return this.typeEquipmentService.create(createTypeEquipmentDto);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin')
  @Get()
  findAll() {
    return this.typeEquipmentService.findAll();
  }

  @Get('viewByType/:id')
  findOne(@Param('id') id: string) {
    return this.typeEquipmentService.findOne(+id);
  }

  @Roles('super_admin', 'admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeEquipmentDto: UpdateTypeEquipmentDto) {
    return this.typeEquipmentService.update(+id, updateTypeEquipmentDto);
  }

  @Roles('super_admin', 'admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeEquipmentService.remove(+id);
  }

  @Roles('super_admin', 'admin')
  @Get('viewByEquipment')
  viewByEquipment(@Request() req) {
    return this.typeEquipmentService.viewByEquipment(req.user);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin', 'master_maintainer', 'maintainer', 'user')
  @Get('userViewEquipment')
  viewEquipment(@Request() req) {
    return this.typeEquipmentService.viewEquipment(req.user);
  }
}
