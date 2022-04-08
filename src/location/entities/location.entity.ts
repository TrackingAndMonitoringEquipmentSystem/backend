import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Locker } from "src/lockers/entities/locker.entity";

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    location_id: number;

    @Column()
    building: string;

    @Column()
    floor: string;

    @Column()
    room: string;

    @OneToMany(() => Locker, locker => locker.location)
    lockers: Locker[];
}