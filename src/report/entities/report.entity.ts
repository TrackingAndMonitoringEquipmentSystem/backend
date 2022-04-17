import { Equipment } from "src/equipment/entities/equipment.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    reported_at: Date;

    @Column()
    status: string;

    @Column()
    description: string;

    @ManyToOne(() => Equipment, (equipment) => equipment.reports)
    equipment: Equipment;

    @ManyToOne(() => User, (user) => user.reports)
    user: User;
}
