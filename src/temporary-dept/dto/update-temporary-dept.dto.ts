import { PartialType } from '@nestjs/swagger';
import { CreateTemporaryDeptDto } from './create-temporary-dept.dto';

export class UpdateTemporaryDeptDto extends PartialType(CreateTemporaryDeptDto) {}
