import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Department } from 'src/department/entities/department.entity';
import { Timestamp } from 'typeorm';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @Matches(/[a-zA-z]{3,20}/)
  firstName: string;

  @IsNotEmpty()
  @Matches(/[a-zA-z]{3,20}/)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  status: string;

  @IsNotEmpty()
  fcm_token: string;

  @IsNotEmpty()
  @Matches(/^06|08|09\d{8}/)
  tel: string;

  @IsOptional()
  gender: string;

  @IsOptional()
  birth_date: Date;

  @IsOptional()
  face_id: string;

  @IsOptional()
  profile_pic: string;

  @IsNotEmpty()
  role: Role;

  @IsOptional()
  roleId?: number;

  @IsNotEmpty()
  dept: Department;

  /*created_at: Date;
    updated_at: Date;*/
  //updated_by: User;
}
