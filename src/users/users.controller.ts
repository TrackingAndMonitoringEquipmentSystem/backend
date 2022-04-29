import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { csvFileFilter, csvFileName, getCSVFile, UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateOnWeb } from './dto/create-on-web.dto';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { Roles } from 'src/utils/guard/roles.decorator';
import { RolesAndDeptGuard } from 'src/utils/guard/rolesAndDept.guard';

import { CreateByAdmin } from './dto/create-by-admin.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { UserCsv } from './dto/user-csv.dto';
import { CsvParser } from 'nest-csv-parser';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private service: UsersService,
    private readonly sendGrid: SendGridService,
    private readonly csvParser: CsvParser
  ) { }

  @UseGuards(RolesAndDeptGuard)
  @Roles('self', 'super_admin')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('self', 'super_admin', 'admin')
  @Post('/createUser')
  create(@Request() req, @Body() createByAdmin: CreateByAdmin) {
    return this.service.createByAdmin(createByAdmin, req.actorId);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles(
    'self',
    'super_admin',
    'admin',
    'master_maintainer',
    'maintainer',
    'user',
  )
  @Put('updatebyId/:id')
  update(
    @Request() req,
    @Param() params,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.service.updateUser(params.id, updateUserDto, req.actorId);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles(
    'self',
    'super_admin',
    'admin',
    'master_maintainer',
    'maintainer',
    'user',
  )
  @Delete('remove/:id')
  removeUser(@Param() params) {
    return this.service.remove(params.id);
  }

  @Put('send-mail')
  async sendMail(): Promise<any> {
    const result = await this.sendGrid.send({
      to: 'game47you@gmail.com',
      from: '6101013@kmitl.ac.th',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    });
    return result;
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('self', 'super_admin', 'admin')
  @Put('/approve/:id')
  approve(@Request() req, @Param() params) {
    return this.service.approve(params.id, req.actorId);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('self', 'super_admin', 'admin')
  @Put('block/:id')
  block(@Request() req, @Param() params) {
    return this.service.block(params.id, req.actorId);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('self', 'super_admin', 'admin')
  @Put('unblock/:id')
  unBlock(@Request() req, @Param() params) {
    return this.service.unBlock(params.id, req.actorId);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles(
    'self',
    'super_admin',
    'admin',
    'master_maintainer',
    'maintainer',
    'user',
  )
  @Get('/viewUser/:id')
  view(@Param() params) {
    return this.service.viewUser(params.id);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin')
  @Post('createOnWeb')
  createOnWeb(@Body() createOnWeb: CreateOnWeb[], @Request() req) {
    return this.service.createUserOnWeb(createOnWeb, req.user);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles(
    'self',
    'super_admin',
    'admin',
    'master_maintainer',
    'maintainer',
    'user',
  )
  @Post('addFaceId/:id')
  addFaceId(@Body() body: any, @Request() req, @Param('id') id: number) {
    return this.service.addFaceid(id, body.imagebase64, req.user);
  }

  @Post('sendNotiToUser')
  sendNoti(@Body() body) {
    return this.service.sendNotiToUser(body.userId, body.data);
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'
    , {
      storage: diskStorage({
        destination: './uploads/csv',
        filename: csvFileName,
      }),
      fileFilter: csvFileFilter,
    }
  ),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.service.parse(req.user);
  }
}
