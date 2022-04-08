import { IsNotEmpty } from "class-validator";

export class CreateLocationDto {

    @IsNotEmpty()
    building: string;

    @IsNotEmpty()
    floor: string;

    @IsNotEmpty()
    room: string;
}
