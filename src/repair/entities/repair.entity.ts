import { Equipment } from "src/equipment/entities/equipment.entity";
import { GroupRepair } from "src/group-repair/entities/group-repair.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Repair {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    requested_at: Date;

    @Column()
    approved_at: Date;

    @Column()
    description: string;

    @Column()
    status: string;

    @Column()
    repair_at: Date;

    @Column()
    finished_at: Date;

    @ManyToOne(() => Equipment, (equipment) => equipment.repairs)
    equipment: Equipment;

    @ManyToOne(() => GroupRepair, (groupRepair) => groupRepair.repairs)
    groupRepair: GroupRepair;

    @ManyToOne(() => User, (user) => user.repairs)
    user: User;

    @ManyToOne(type => User, { nullable : true })
    @JoinColumn({
        name: 'maintainer_id',
        referencedColumnName: 'id'
    })
    maintainer_id: User;
}
