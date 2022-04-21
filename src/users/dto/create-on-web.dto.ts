import { Department } from "src/department/entities/department.entity";
import { Role } from "../entities/role.entity";

export class CreateOnWeb {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    dept: Department;
    tel: string;
}