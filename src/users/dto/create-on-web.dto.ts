import { IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { Department } from "src/department/entities/department.entity";
import { Role } from "../entities/role.entity";

export class CreateOnWeb {
    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    role: Role;

    @IsNotEmpty()
    dept: Department;

    @IsOptional()
    @Matches(/^06|08|09\d{8}/)
    tel: string;
}