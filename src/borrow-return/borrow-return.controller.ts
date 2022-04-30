import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Request } from '@nestjs/common';
import { Roles } from 'src/utils/guard/roles.decorator';
import { RolesAndDeptGuard } from 'src/utils/guard/rolesAndDept.guard';
import { BorrowReturnService } from './borrow-return.service';
import { CreateBorrowReturnDto } from './dto/create-borrow-return.dto';
import { ReturnDto } from './dto/return.dto';
import { UpdateBorrowReturnDto } from './dto/update-borrow-return.dto';

@Controller('borrow')
export class BorrowReturnController {
  constructor(private readonly borrowReturnService: BorrowReturnService) { }

  // @UseGuards(RolesAndDeptGuard)
  // @Roles('super_admin', 'admin', 'master_maintainer', 'maintainer', 'user')
  @Post()
  borrow(@Body() createBorrowRetunDto: CreateBorrowReturnDto) {
    return this.borrowReturnService.borrow(createBorrowRetunDto);
  }

  // @UseGuards(RolesAndDeptGuard)
  // @Roles('super_admin', 'admin', 'master_maintainer', 'maintainer', 'user')
  @Patch('return/:groupId')
  return(@Param('groupId') id: number) {
    return this.borrowReturnService.return(id);
  }

  @Get('viewGroup/:userId')
  viewGroup(@Param('userId') id: number) {
    return this.borrowReturnService.findGroupByUserId(id);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin', 'master_maintainer', 'maintainer', 'user')
  @Get('viewAllBorrow')
  findAll(@Request() req) {
    // return this.borrowReturnService.findAll(req.user);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin', 'master_maintainer', 'maintainer', 'user')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.borrowReturnService.findOne(id);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin')
  @Get('viewHistory/:equipmentId')
  viewHistory(@Param('equipmentId') id: number) {
    return this.borrowReturnService.viewHistory(id);
  }

  @Get('viewByGroup/:groupId')
  viewByGroup(@Param('groupId') id: number) {
    return this.borrowReturnService.viewByGroupId(id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.borrowReturnService.remove(+id);
  // }
}
