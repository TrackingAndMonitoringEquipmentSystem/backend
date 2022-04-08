import { IsNotEmpty } from "class-validator";
import { Department } from "src/department/entities/department.entity";
import { Locker } from "src/lockers/entities/locker.entity";

export class CreateTemporaryDeptDto {
    @IsNotEmpty()
    start_date: Date;

    @IsNotEmpty()
    end_date: Date;

    @IsNotEmpty()
    department: Department;

    locker: Locker;
}
