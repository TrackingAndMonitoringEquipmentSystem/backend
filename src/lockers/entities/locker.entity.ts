import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Department } from 'src/department/entities/department.entity';
import { VideoRecord } from 'src/video-record/entities/video-record.entity';
import { TemporaryUser } from 'src/temporary-user/entities/temporary-user.entity';
import { TemporaryDept } from 'src/temporary-dept/entities/temporary-dept.entity';
import { Camera } from 'src/camera/entities/camera.entity';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { Room } from 'src/location/entities/room.entity';

@Entity()
export class Locker {
  @PrimaryGeneratedColumn()
  locker_id: number;

  @Column({ nullable: true })
  locker_name: string;

  @Column({ nullable: true })
  num_camera: number;

  @Column({ nullable: true })
  description: string;

  @Column()
  status: string;

  @ManyToOne(() => Room, (room) => room.lockers)
  room: Room;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({
    name: 'created_by',
    referencedColumnName: 'id',
  })
  created_by: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({
    name: 'updated_by',
    referencedColumnName: 'id',
  })
  updated_by: User;

  @ManyToMany(() => Department, (department) => department.locker)
  @JoinTable()
  department: Department[];

  @ManyToOne(() => VideoRecord, (videoRecord) => videoRecord.locker)
  videos: VideoRecord[];

  @OneToMany(() => TemporaryUser, (temporaryUsers) => temporaryUsers.locker)
  temporaryUsers!: TemporaryUser[];

  @OneToMany(() => TemporaryDept, (temporaryDepts) => temporaryDepts.locker)
  temporaryDepts!: TemporaryDept[];

  @OneToMany(() => Camera, (camera) => camera.locker)
  cameras: Camera[];

  @OneToMany(() => Equipment, (equipment) => equipment.locker)
  equipment: Equipment[];
}
