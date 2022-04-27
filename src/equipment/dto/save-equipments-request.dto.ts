import { IsNotEmpty, IsOptional } from 'class-validator';

export class SaveEquipmentsRequestDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  equipments: EquipmentSave[];

  @IsNotEmpty()
  lockerId: number;
}

export class EquipmentSave {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  typeId?: number;

  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  macAddress: string;

  @IsNotEmpty()
  base64Image: string;
}
