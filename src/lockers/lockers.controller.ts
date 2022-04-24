import { getResponse } from 'src/utils/response';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LockersService } from './lockers.service';
import { CreateLockerDto } from './dto/create-locker.dto';
import { UpdateLockerDto } from './dto/update-locker.dto';
import { RolesAndLockerGuard } from 'src/utils/guard/rolesAndLocker.guard';
import { Roles } from 'src/utils/guard/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { LockerGateway } from './locker.gateway';
import { RolesAndDeptGuard } from 'src/utils/guard/rolesAndDept.guard';

@ApiTags('lockers')
@Controller('lockers')
export class LockersController {
  constructor(
    private readonly lockersService: LockersService,
    private readonly lockerGateway: LockerGateway,
  ) {}

  @UseGuards(RolesAndLockerGuard)
  @Roles('create', 'super_admin', 'admin')
  @Post('registerLocker/:locker')
  create(
    @Request() req,
    @Param('locker') locker: string,
    @Body() createLockerDto: CreateLockerDto,
  ) {
    return this.lockersService.register(+locker, createLockerDto, req.actor);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin', 'master_maintainer', 'maintainer', 'user')
  @Get()
  viewAll(@Request() req) {
    return this.lockersService.findAll(req.user);
  }

  @Post('preRegister/:numCamera')
  preRegister(@Param('numCamera') numCamera: number) {
    return this.lockersService.preRegis(numCamera);
  }

  @UseGuards(RolesAndLockerGuard)
  @Roles('admin', 'super_admin')
  @Get('viewLocker/:locker')
  view(@Param('locker') id: string) {
    return this.lockersService.find(id);
  }

  @UseGuards(RolesAndLockerGuard)
  @Roles('super_admin', 'admin')
  @Patch('updateLocker/:locker')
  update(
    @Request() req,
    @Param('locker') id: string,
    @Body() updateLockerDto: UpdateLockerDto,
  ) {
    return this.lockersService.update(+id, updateLockerDto, req.actor);
  }

  @UseGuards(RolesAndLockerGuard)
  @Roles('super_admin', 'admin')
  @Delete('remove/:locker')
  remove(@Param('locker') id: string) {
    return this.lockersService.remove(+id);
  }

  @UseGuards(RolesAndLockerGuard)
  @Roles('super_admin', 'admin')
  @Get('viewStream/:locker')
  stream(@Param('locker') id: string): string {
    return `id: ${id}`;
  }

  @UseGuards(RolesAndLockerGuard)
  @Roles('super_admin', 'admin', 'tempUser')
  @Post('getOpenToken/:locker')
  getOpenToken(@Request() req, @Param('locker') id: string) {
    return this.lockersService.getOpenToken(req.actor, id);
  }

  @UseGuards(AuthGuard('jwt')) //ใช้ได้แล้ว
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

  @Get('lockersByDepartment/:departmentId')
  getLockersByDepartment(@Param('departmentId') departmentId: number) {
    return this.lockersService.getLockersByDepartment(departmentId);
  }

  @Get('addEquipment/:locker')
  async addEquipment(@Param('locker') lockerId: number) {
    const result = await this.lockerGateway.addEquipment(lockerId);
    return getResponse('00', result);
  }

  /*@UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin', 'user')
  @Get('locker')
  viewLocker(@Query() query , @Request() req){
    return this.departmentService.viewLockerByDepartment(req.user);
  }*/

  @UseGuards(RolesAndDeptGuard)
  @Roles('master_maintainer', 'maintainer')
  @Get('viewRepair')
  viewRepair() {
    return this.lockersService.viewRepair();
  }
}
