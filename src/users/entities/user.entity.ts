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
import { Role } from './role.entity';
import { Department } from 'src/department/entities/department.entity';
import { VideoRecord } from 'src/video-record/entities/video-record.entity';
import { TemporaryUser } from 'src/temporary-user/entities/temporary-user.entity';
import { BorrowReturn } from 'src/borrow-return/entities/borrow-return.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { Report } from 'src/report/entities/report.entity';

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

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'updated_by',
    referencedColumnName: 'id',
  })
  updated_by: User;

  @OneToMany(() => VideoRecord, (videoRecord) => videoRecord.user)
  videos: VideoRecord[];

  @OneToMany(() => TemporaryUser, (temporaryUsers) => temporaryUsers.user)
  temporaryUsers!: TemporaryUser[];

  @OneToMany(() => BorrowReturn, (borrowReturn) => borrowReturn.user)
  borrowReturns: BorrowReturn[];

  @OneToMany(() => Repair, (repair) => repair.user)
  repairs: Repair[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
