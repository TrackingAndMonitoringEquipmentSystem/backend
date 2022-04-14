import { UsersService } from 'src/users/users.service';
import { Module } from "@nestjs/common";
import { DepartmentModule } from "src/department/department.module";
import { DepartmentService } from "src/department/department.service";
import { UsersModule } from "src/users/users.module";
import { PublicController } from "./public.controller";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/department/entities/department.entity';

@Module({
    imports: [
        DepartmentModule,
        TypeOrmModule.forFeature([Department]),
        UsersModule],
    controllers: [PublicController],
    providers: [DepartmentService],
    exports: []
})
export class PublicModule { }
