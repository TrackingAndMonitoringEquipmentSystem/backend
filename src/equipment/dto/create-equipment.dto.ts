import { IsNotEmpty } from "class-validator";
import { Locker } from "src/lockers/entities/locker.entity";
import { TypeEquipment } from "src/type-equipment/entities/type-equipment.entity";

export class CreateEquipmentDto {
    @IsNotEmpty()
    tag_id: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    equip_pic: string;

    @IsNotEmpty()
    duration: number;

    @IsNotEmpty()
    type: TypeEquipment;

    @IsNotEmpty()
    locker: Locker;
}
