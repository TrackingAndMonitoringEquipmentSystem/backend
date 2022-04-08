import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TemporaryUserService } from './temporary-user.service';
import { CreateTemporaryUserDto } from './dto/create-temporary-user.dto';
import { UpdateTemporaryUserDto } from './dto/update-temporary-user.dto';
import { RolesAndLockerGuard } from 'src/utils/guard/rolesAndLocker.guard';
import { Roles } from 'src/utils/guard/roles.decorator';

@UseGuards(RolesAndLockerGuard)

@Controller('lockers/temp-user')
export class TemporaryUserController {
  constructor(private readonly temporaryUserService: TemporaryUserService) {}

  @Roles('super_admin', 'admin')
  @Post(':locker')
  create(@Param('locker') locker:string ,@Body() createTemporaryUserDto: CreateTemporaryUserDto) {
    return this.temporaryUserService.create(+locker,createTemporaryUserDto);
  }

  @Get(':locker')
  findAll(@Param('locker') locker: string) {
    return this.temporaryUserService.findAll(+locker);
  }

  @Get(':locker/:user')
  findOne(@Param('locker') locker: string, @Param('user') user: string) {
    return this.temporaryUserService.findOne(+locker, +user);
  }

  @Patch(':locker/:user')
  update(@Param('locker') locker: string, @Param('user') user: string, @Body() updateTemporaryUserDto: UpdateTemporaryUserDto) {
    return this.temporaryUserService.update(+locker, +user , updateTemporaryUserDto);
  }

  @Roles('super_admin', 'admin')
  @Delete(':locker/:user')
  remove(@Param('locker') locker: string, @Param('user') user: string) {
    return this.temporaryUserService.remove(+locker, +user);
  }

  /*9@Get('/getTempUser/:locker/:user')
  findTempUser(@Param('locker') locker: string, @Param('user') user: string) {
    return this.temporaryUserService.findtempUser(locker, +user);
  }*/
}
