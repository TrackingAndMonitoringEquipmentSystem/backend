import { BorrowReturn } from "src/borrow-return/entities/borrow-return.entity";
import { Repair } from "src/repair/entities/repair.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GroupRepair {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @OneToMany(() => Repair, (repair) => repair.groupRepair)
    repairs: Repair[];
}
