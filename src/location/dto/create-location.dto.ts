import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsOptional()
  buildingId: string;

  @IsOptional()
  buildingName: string;

  @IsOptional()
  floorId: string;

  @IsOptional()
  floorName: string;

  @IsNotEmpty()
  roomName: string;
}
