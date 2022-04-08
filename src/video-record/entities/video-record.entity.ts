import { Locker } from "src/lockers/entities/locker.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class VideoRecord {
    @PrimaryGeneratedColumn()
    file_id: Number;

    @Column()
    file_name: string;

    @Column()
    action: string;

    @Column()
    open_time: Date;

    @CreateDateColumn()
    recorded_at: Date;

    @ManyToOne(() => Locker, locker => locker.videos)
    locker: Locker;

    @ManyToOne(() => User, user => user.videos)
    user: User;
}
