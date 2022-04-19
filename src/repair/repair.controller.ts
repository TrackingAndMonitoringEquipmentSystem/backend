import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { RepairService } from './repair.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { RolesAndDeptGuard } from 'src/utils/guard/rolesAndDept.guard';
import { Roles } from 'src/utils/guard/roles.decorator';


@UseGuards(RolesAndDeptGuard)
@Controller('repair')
export class RepairController {
  constructor(private readonly repairService: RepairService) { }

  @Roles('super_admin', 'admin', 'master_maintainer', 'maintainer', 'user')
  @Post('report-repair/:id')
  create(@Body() createRepairDto: CreateRepairDto, @Param('id') id: string, @Req() req) {
    return this.repairService.create(+id, createRepairDto, req.actorId);
  }

  /* @UseGuards(RolesAndDeptGuard)
   @Roles('master_maintainer', 'maintainer')
   @Get('getAllRepairList/12345')
   requestRepairList() {
     return '5555';
     //return this.repairService.findRepairList();
   }*/

  @UseGuards(RolesAndDeptGuard)
  @Roles('master_maintainer', 'maintainer')
  @Patch('repair/:id')
  repair(@Param('id') id: string, @Req() req) {
    return this.repairService.repair(+id, req.actorId);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('master_maintainer', 'maintainer')
  @Patch('finishRepair/:id')
  finishRepair(@Param('id') id: string, @Req() req) {
    return this.repairService.finishRepair(+id, req.actorId);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin')
  @Get('getReportRepairList/:id')
  request(@Param('id') id: string) {
    console.log('123');
    return this.repairService.findReportByEquipId(+id);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin')
  @Post('createRequest/:id')
  createRequest(@Param('id') id: string, @Req() req) {
    return this.repairService.sendRequest(id, req.actorId);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin')
  @Patch('cancelRequest/:id')
  cancel(@Param('id') id: string) {
    return this.repairService.cancelRequest(id);
  }

  // @Roles('super_admin', 'admin')
  // @Get('viewHistory/:equipmentId')
  // viewHistory(@Param('equipmentId') id: number) {
  //   return this.repairService.viewHistory(id);
  // }
}
