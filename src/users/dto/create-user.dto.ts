import { IsDate, IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { Timestamp } from "typeorm";


export class CreateUserDto {
    @IsNotEmpty()
    @Matches(/[a-zA-z]{3,20}/)
    firstName:string;

    @IsNotEmpty()
    @Matches(/[a-zA-z]{3,20}/)
    lastName:string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    status: string;

    @IsNotEmpty()
    fcm_token: string;

    @IsNotEmpty()
    @Matches(/^06|08|09\d{8}/)
    tel:string;    

    @IsNotEmpty()
    gender: string;
    
    @IsNotEmpty()
    birth_date: Date;

    @IsNotEmpty()
    face_id: string;

    @IsNotEmpty()
    profile_pic: string;

    /*@IsNotEmpty()
    roleId: number;

    @IsNotEmpty()
    deptId: number;*/

    /*created_at: Date;
    updated_at: Date;*/
}
