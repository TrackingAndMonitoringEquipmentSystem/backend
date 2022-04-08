import { IsNotEmpty } from "class-validator";
import { Locker } from "src/lockers/entities/locker.entity";
import { User } from "src/users/entities/user.entity";

export class CreateVideoRecordDto {
    @IsNotEmpty()
    file_name: string;

    @IsNotEmpty()
    action: string;

    @IsNotEmpty()
    open_time: Date;

    @IsNotEmpty()
    recorded_at: Date;

    user: User;
}
