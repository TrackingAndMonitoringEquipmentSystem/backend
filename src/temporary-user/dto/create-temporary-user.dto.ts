import { IsNotEmpty } from "class-validator";
import { Locker } from "src/lockers/entities/locker.entity";
import { User } from "src/users/entities/user.entity";
import { DetailedPeerCertificate } from "tls";

export class CreateTemporaryUserDto {
    @IsNotEmpty()
    start_date: Date;

    @IsNotEmpty()
    end_date: Date;

    @IsNotEmpty()
    user: User;

    locker: Locker;
}
