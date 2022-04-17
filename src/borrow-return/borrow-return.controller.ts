import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/utils/guard/roles.decorator';
import { RolesAndDeptGuard } from 'src/utils/guard/rolesAndDept.guard';
import { BorrowReturnService } from './borrow-return.service';
import { CreateBorrowReturnDto } from './dto/create-borrow-return.dto';
import { UpdateBorrowReturnDto } from './dto/update-borrow-return.dto';

@Controller('equipment')
export class BorrowReturnController {
  constructor(private readonly borrowReturnService: BorrowReturnService) {}

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin', 'master_maintainer', 'maintainer', 'user')
  @Post('borrow/:id')
  borrow(@Param('id') ids:string, @Req() req) {
    return this.borrowReturnService.borrow(ids, req.actorId );
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin', 'master_maintainer', 'maintainer', 'user')
  @Patch('return/:id')
  return(@Param('id') ids: string,@Req() req) {
    return this.borrowReturnService.return(ids, req.actorId);
  }
  
  /*@Get()
  findAll() {
    return this.borrowReturnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowReturnService.findOne(+id);
  }

  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowReturnService.remove(+id);
  }*/
}
