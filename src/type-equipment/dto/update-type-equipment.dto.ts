import { PartialType } from '@nestjs/swagger';
import { CreateTypeEquipmentDto } from './create-type-equipment.dto';

export class UpdateTypeEquipmentDto extends PartialType(CreateTypeEquipmentDto) {}
