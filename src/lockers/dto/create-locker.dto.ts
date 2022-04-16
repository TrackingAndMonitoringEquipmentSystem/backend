import { IsNotEmpty } from 'class-validator';
import { Department } from 'src/department/entities/department.entity';
import { Room } from 'src/location/entities/room.entity';

export class CreateLockerDto {
  @IsNotEmpty()
  locker_name: string;

  @IsNotEmpty()
  num_camera: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  deptId: Department[];

  @IsNotEmpty()
  room: Room;

  status: string;
}
