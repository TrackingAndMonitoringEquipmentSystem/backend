import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DepartmentService } from 'src/department/department.service';

@ApiTags('publics')
@Controller('publics')
export class PublicController {
  constructor(private readonly departmentService: DepartmentService) {}
  @Get('/departments')
  findAll() {
    return this.departmentService.viewAll();
  }
}
