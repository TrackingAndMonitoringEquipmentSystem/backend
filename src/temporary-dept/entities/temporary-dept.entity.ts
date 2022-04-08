import { Department } from "src/department/entities/department.entity";
import { Locker } from "src/lockers/entities/locker.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TemporaryDept {
    @PrimaryGeneratedColumn()
    id: Number;
    
    @Column({ type: Date})
    start_date: Date;

    @Column({ type: Date})
    end_date: Date;

    @ManyToOne(() => Department, department => department.temporaryDepts)
    department: Department;

    @ManyToOne(() => Locker, locker => locker.temporaryDepts)
    locker: Locker;
}
