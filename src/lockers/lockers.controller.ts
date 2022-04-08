import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req } from '@nestjs/common';
import { LockersService } from './lockers.service';
import { CreateLockerDto } from './dto/create-locker.dto';
import { UpdateLockerDto } from './dto/update-locker.dto';
import { RolesAndLockerGuard } from 'src/utils/guard/rolesAndLocker.guard';
import { Roles } from 'src/utils/guard/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { OrGuard } from '@nest-lab/or-guard';
import { RolesAndDeptGuard } from 'src/utils/guard/rolesAndDept.guard';



@Controller('lockers')
export class LockersController {
  constructor(private readonly lockersService: LockersService) { }

  @UseGuards(RolesAndLockerGuard)
  @Roles('super_admin', 'admin')
  @Post('registerLocker/:locker')
  create(@Request() req,@Param('locker') locker:string ,@Body() createLockerDto: CreateLockerDto) {
    return this.lockersService.register(+locker, createLockerDto, req.actor);
  }

  @UseGuards(RolesAndLockerGuard)
  @Roles('super_admin')
  @Get()
  viewAll() {
    return this.lockersService.findAll();
  }

  @UseGuards(RolesAndDeptGuard)  
  @Roles('super_admin', 'admin')
  @Post('preRegister')
  preRegister(@Request() req) {
    return this.lockersService.preRegis(req.actor);
  }
  

  @UseGuards(RolesAndLockerGuard)
  @Roles('admin')
  @Get('viewLocker/:locker')
  view(@Param('locker') id: string) {
    return this.lockersService.find(id);
  }

  @UseGuards(RolesAndLockerGuard)
  @Roles('super_admin','admin')
  @Patch('updateLocker/:locker')
  update(@Request() req, @Param('locker') id: string, @Body() updateLockerDto: UpdateLockerDto) {
    return this.lockersService.update(+id, updateLockerDto, req.actor);
  }

  @UseGuards(RolesAndLockerGuard)
  @Roles('super_admin','admin')
  @Delete('remove/:locker')
  remove(@Param('locker') id: string) {
    return this.lockersService.remove(+id);
  }

  @UseGuards(RolesAndLockerGuard)
  @Roles('super_admin','admin')
  @Get('viewStream/:locker')
  stream(@Param('locker') id: string) {

  }

  
  @UseGuards(RolesAndLockerGuard)
  @Roles('super_admin', 'admin', 'tempUser')
  @Post('getOpenToken/:locker')
  getOpenToken(@Request() req, @Param('locker') id: string) {
    return this.lockersService.getOpenToken(req.actor, id);
  }

  @UseGuards(AuthGuard('jwt'))   //ใช้ได้แล้ว
  @Get('verify/:locker')
  verifyToken(@Request() req, @Param('locker') locker: string) {
    return this.lockersService.verifyToken(+locker, req.user);
  }

  //@UseGuards(RolesAndLockerGuard)
  //@Roles('super_admin','admin','master_maintainer', 'maintainer', 'user')
  @Get('openByFaceId/:locker')
  validateFaceid(@Body() data: any, @Param('locker') id: string) {
    return this.lockersService.validateFaceID(data, id);
  }


}
