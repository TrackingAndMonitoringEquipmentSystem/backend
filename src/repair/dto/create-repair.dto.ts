import { IsNotEmpty } from "class-validator";

export class CreateRepairDto {
    @IsNotEmpty()
    description: string;
}
