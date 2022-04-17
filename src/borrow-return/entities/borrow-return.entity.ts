import { Equipment } from "src/equipment/entities/equipment.entity";
import { GroupBorrow } from "src/group-borrow/entities/group-borrow.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BorrowReturn {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    borrowed_at: Date;

    @Column()
    deadline_at: Date;

    @Column()
    return_at: Date;

    @ManyToOne(() => Equipment, (equipment) => equipment.borrowReturns)
    equipment: Equipment;

    @ManyToOne(() => GroupBorrow, (groupBorrow) => groupBorrow.borrowReturns)
    groupBorrow: GroupBorrow;

    @ManyToOne(() => User, (user) => user.borrowReturns)
    user: User;
}
