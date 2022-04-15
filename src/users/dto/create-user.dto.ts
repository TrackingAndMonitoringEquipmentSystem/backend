import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Department } from 'src/department/entities/department.entity';
import { Role } from '../entities/role.entity';

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
