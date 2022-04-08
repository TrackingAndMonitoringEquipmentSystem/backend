import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { Role } from 'src/users/entities/role.entity';
import { Roles } from 'src/utils/guard/roles.decorator';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { RolesAndLockerGuard } from 'src/utils/guard/rolesAndLocker.guard'; 
import { RolesAndDeptGuard } from 'src/utils/guard/rolesAndDept.guard';

@UseGuards(RolesAndDeptGuard)
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Roles('super_admin')
  @Post('/createDepartment')
  create(@Request() req , @Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto, req.actorId );
  }

  @Roles('super_admin')
  @Get()
  findAll() {
    return this.departmentService.viewAll();
  }

  @Get('viewDepartment/:id')
  findOne(@Param('id') ids: string) {
    return this.departmentService.viewDepartment(ids);
  }

  @Roles('super_admin')
  @Patch('updateDepartment/:id')
  update(@Request() req, @Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.update(id, updateDepartmentDto, req.actorId);
  }

  @Roles('super_admin')
  @Delete('removeDepartment/:id')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(+id);
  }
}
