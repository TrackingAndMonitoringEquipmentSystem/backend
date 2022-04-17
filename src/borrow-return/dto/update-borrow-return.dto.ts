import { PartialType } from '@nestjs/swagger';
import { CreateBorrowReturnDto } from './create-borrow-return.dto';

export class UpdateBorrowReturnDto extends PartialType(CreateBorrowReturnDto) {}
