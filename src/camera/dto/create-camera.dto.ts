import { IsNotEmpty } from "class-validator";
import { Locker } from "src/lockers/entities/locker.entity";

export class CreateCameraDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    recent_picture: string;

    locker: Locker;
}
