import { IsNotEmpty, IsOptional } from 'class-validator';
import { Department } from 'src/department/entities/department.entity';

export class CreateLockerDto {
  @IsNotEmpty()
  locker_name: string;

  @IsOptional()
  num_camera: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  deptId: Department[];

  @IsNotEmpty()
  roomId: number;

  status: string;
}
