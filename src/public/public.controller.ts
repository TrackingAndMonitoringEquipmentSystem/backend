import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DepartmentService } from 'src/department/department.service';
import * as admin from 'firebase-admin';
import { IsNotEmpty } from 'class-validator';

class UpdateRoleDto {
  @IsNotEmpty()
  uid: string;
  @IsNotEmpty()
  role: string;
}

@ApiTags('publics')
@Controller('publics')
export class PublicController {
  constructor(private readonly departmentService: DepartmentService) {}
  @Get('/departments')
  findAll() {
    return this.departmentService.viewAll();
  }

  @Patch('/users/update-role')
  async updateRole(@Body() body: UpdateRoleDto) {
    return await admin.auth().setCustomUserClaims(body.uid, {
      role: body.role,
    });
  }
}
