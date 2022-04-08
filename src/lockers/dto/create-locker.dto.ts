import { IsNotEmpty } from "class-validator";
import { Department } from "src/department/entities/department.entity";
import { Location } from "src/location/entities/location.entity";

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
    location: Location;
    status: string;
    /*location: {
        building: string;
        floor: string;
        room: string;
    }*/
}
