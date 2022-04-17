import { PartialType } from '@nestjs/swagger';
import { CreateGroupBorrowDto } from './create-group-borrow.dto';

export class UpdateGroupBorrowDto extends PartialType(CreateGroupBorrowDto) {}
