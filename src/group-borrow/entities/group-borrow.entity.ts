import { BorrowReturn } from "src/borrow-return/entities/borrow-return.entity";
import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GroupBorrow {
    @PrimaryGeneratedColumn()
    id: Number;
    
    @OneToMany(() => BorrowReturn, (borrowReturn) => borrowReturn.groupBorrow)
    borrowReturns: BorrowReturn[]
}
