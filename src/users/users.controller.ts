import { Controller, Get, Post, Body,Put, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param() params) {
        return this.service.findOne(params.id);
    }

    @Post()
    create(@Body() CreateUserDto: CreateUserDto) {
        return this.service.createUser(CreateUserDto);
    }

    @Put(":id")
    update(@Param() params,@Body() updateUserDto: UpdateUserDto) {
        return this.service.updateUser(params.id,updateUserDto);
    }

    @Delete(':id')
    deleteUser(@Param() params) {
        return this.service.remove(params.id);
    }
}