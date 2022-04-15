import { IsNotEmpty } from 'class-validator';
import { Department } from 'src/department/entities/department.entity';
import { Role } from '../entities/role.entity';

export class CreateByAdmin {
  @IsNotEmpty()
  role: Role;

  @IsNotEmpty()
  dept: Department;

  @IsNotEmpty()
  email: string[];
}
