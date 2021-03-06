import { IsNotEmpty } from "class-validator";
import { User } from "src/users/entities/user.entity";

export class CreateBorrowReturnDto {
    @IsNotEmpty()
    tag_ids: string;

    @IsNotEmpty()
    userId: User;
}
