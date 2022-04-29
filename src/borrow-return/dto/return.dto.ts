import { IsNotEmpty } from "class-validator";
import { GroupBorrow } from "src/group-borrow/entities/group-borrow.entity";
import { User } from "src/users/entities/user.entity";

export class ReturnDto {
    @IsNotEmpty()
    groupId: GroupBorrow;

    @IsNotEmpty()
    userId: User;
}