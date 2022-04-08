import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TemporaryDeptService } from './temporary-dept.service';
import { CreateTemporaryDeptDto } from './dto/create-temporary-dept.dto';
import { UpdateTemporaryDeptDto } from './dto/update-temporary-dept.dto';
import { RolesAndLockerGuard } from 'src/utils/guard/rolesAndLocker.guard';
import { Roles } from 'src/utils/guard/roles.decorator';
import { Locker } from 'src/lockers/entities/locker.entity';

@UseGuards(RolesAndLockerGuard)
@Controller('lockers/temp-dept')
export class TemporaryDeptController {
  constructor(private readonly temporaryDeptService: TemporaryDeptService) {}

  @Roles('super_admin', 'admin')
  @Post(':locker')
  create(@Param('locker') locker: string, @Body() createTemporaryDeptDto: CreateTemporaryDeptDto) {
    return this.temporaryDeptService.create(+locker, createTemporaryDeptDto);
  }

  @Roles('super_admin', 'admin')
  @Get(':locker')
  findAll(@Param('locker') locker: string) {
    return this.temporaryDeptService.findAll(+locker);
  }

  @Roles('super_admin', 'admin')
  @Get(':locker/:dept')
  findOne(@Param('locker') locker: string, @Param('dept') dept: string) {
    return this.temporaryDeptService.findOne(+locker, +dept);
  }

  @Roles('super_admin', 'admin')
  @Patch(':locker/:dept')
  update(@Param('locker') locker: string, @Param('dept') dept: string, @Body() updateTemporaryDeptDto: UpdateTemporaryDeptDto) {
    return this.temporaryDeptService.update(+locker, +dept , updateTemporaryDeptDto);
  }

  @Roles('super_admin', 'admin')
  @Delete(':locker/:dept')
  remove(@Param('locker') locker: string, @Param('dept') dept:string) {
    //return 'delete temp-dept';
    return this.temporaryDeptService.remove(+locker, +dept);
  }
}
