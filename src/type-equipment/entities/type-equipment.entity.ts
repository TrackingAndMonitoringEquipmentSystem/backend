import { Equipment } from "src/equipment/entities/equipment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TypeEquipment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    duration: number;

    @OneToMany(() => Equipment, equipment => equipment.type)
    equipment: Equipment[]
}
