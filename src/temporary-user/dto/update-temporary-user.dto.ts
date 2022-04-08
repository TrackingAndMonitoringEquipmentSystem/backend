import { PartialType } from '@nestjs/swagger';
import { CreateTemporaryUserDto } from './create-temporary-user.dto';

export class UpdateTemporaryUserDto extends PartialType(CreateTemporaryUserDto) {}
