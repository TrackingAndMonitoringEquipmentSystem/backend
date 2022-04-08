import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IsDate, IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Role } from './role.entity';
import { Department } from 'src/department/entities/department.entity';
import { type } from 'os';
import { VideoRecord } from 'src/video-record/entities/video-record.entity';
import { TemporaryUser } from 'src/temporary-user/entities/temporary-user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  status: string;

  @Column()
  fcm_token: string;

  @Column()
  tel: string;

  @Column()
  gender: string;

  @Column({ type: Date })
  birth_date: Date;

  @Column()
  face_id: string;

  @Column()
  profile_pic: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @ManyToOne(() => Department, (dept) => dept.users)
  dept: Department;

  @ManyToOne(type => User)
  @JoinColumn({
    name: 'updated_by',
    referencedColumnName: 'id'
  })
  updated_by: User;

  @OneToMany(() => VideoRecord, (videoRecord) => videoRecord.user)
  videos: VideoRecord[];

  @OneToMany(() => TemporaryUser, temporaryUsers => temporaryUsers.user)
  temporaryUsers!: TemporaryUser[];
}
