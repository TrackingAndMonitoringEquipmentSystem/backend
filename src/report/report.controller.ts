import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Request } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { RolesAndDeptGuard } from 'src/utils/guard/rolesAndDept.guard';
import { Roles } from 'src/utils/guard/roles.decorator';


@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(RolesAndDeptGuard)
  @Roles('admin', 'master_maintainer', 'maintainer', 'user')
  @Post(':equipmentId/:borrowId')
  create(@Body() createReportDto: CreateReportDto, @Param('equipmentId') equipmentId: number, @Param('borrowId') borrowId: number, @Req() req) {
    return this.reportService.create(equipmentId, borrowId, createReportDto, req.actorId );
  }

  /*@UseGuards(RolesAndDeptGuard)
  @Roles('super_admin','admin')*/
  @Get()
  findAll() {
    return this.reportService.findAll();
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('admin', 'master_maintainer', 'maintainer', 'user')
  @Get(':id')
  view(@Param('id') id: string) {
    return this.reportService.view(id);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin','admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto, @Request() req) {
    console.log('test');
    return this.reportService.update(+id, updateReportDto, req.actorId);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportService.remove(+id);
  }
}
