import { Locker } from "src/lockers/entities/locker.entity";
import { TypeEquipment } from "src/type-equipment/entities/type-equipment.entity";

export class CreateEquipmentDto {
    tag_id: string;
    name: string;
    status: string;
    equip_pic: string;
    duration: number;
    type: TypeEquipment;
    locker: Locker;
}
