import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { RolesAndDeptGuard } from 'src/utils/guard/rolesAndDept.guard';
import { Roles } from 'src/utils/guard/roles.decorator';


@Controller('equipment/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(RolesAndDeptGuard)
  @Roles('admin', 'master_maintainer', 'maintainer', 'user')
  @Post(':id')
  create(@Body() createReportDto: CreateReportDto, @Param('id') id: string, @Req() req) {
    return this.reportService.create(+id, createReportDto, req.actorId );
  }

  /*@UseGuards(RolesAndDeptGuard)
  @Roles('super_admin','admin')*/
  @Get('getAllReport')
  findAll() {
    return this.reportService.findAll();
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('admin', 'master_maintainer', 'maintainer', 'user')
  @Get('get/:id')
  view(@Param('id') id: string) {
    return this.reportService.view(id);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin','admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(+id, updateReportDto);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportService.remove(+id);
  }
}
