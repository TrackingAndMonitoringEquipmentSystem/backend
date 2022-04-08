import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/users/entities/user.entity"
import { type, userInfo } from "os";
import { TemporaryDept } from "src/temporary-dept/entities/temporary-dept.entity";

@Entity()
export class Department {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dept_name: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => User, (user) => user.dept)
    users: User[];

    @ManyToOne(type => User, { nullable: false })
    @JoinColumn({
        name: 'created_by',
        referencedColumnName: 'id'
    })
    created_by: User;

    @ManyToOne(type => User, { nullable: false })
    @JoinColumn({
        name: 'updated_by',
        referencedColumnName: 'id'
    })
    updated_by: User;

    @OneToMany(() => TemporaryDept, temporaryDepts => temporaryDepts.department)
     temporaryDepts!: TemporaryDept[];
}
