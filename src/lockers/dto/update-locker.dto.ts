import { PartialType } from '@nestjs/swagger';
import { CreateLockerDto } from './create-locker.dto';

export class UpdateLockerDto extends PartialType(CreateLockerDto) {}
