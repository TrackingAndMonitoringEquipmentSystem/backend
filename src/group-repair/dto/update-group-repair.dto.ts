import { PartialType } from '@nestjs/swagger';
import { CreateGroupRepairDto } from './create-group-repair.dto';

export class UpdateGroupRepairDto extends PartialType(CreateGroupRepairDto) {}
