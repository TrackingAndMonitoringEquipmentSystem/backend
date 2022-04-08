import { Locker } from "src/lockers/entities/locker.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TemporaryUser {
    @PrimaryGeneratedColumn()
    public id: Number;

    @Column()
    public start_date!: Date;

    @Column()
    public end_date!: Date;

    @ManyToOne(() => User, user => user.temporaryUsers)
    public user!: User;

    @ManyToOne(() => Locker, locker => locker.temporaryUsers)
    public locker!: Locker;
}
