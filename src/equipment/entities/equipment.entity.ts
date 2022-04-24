import { BorrowReturn } from 'src/borrow-return/entities/borrow-return.entity';
import { Locker } from 'src/lockers/entities/locker.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { Report } from 'src/report/entities/report.entity';
import { TypeEquipment } from 'src/type-equipment/entities/type-equipment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn()
  equipment_id: number;

  @Column('varchar', { length: 100, unique: true })
  tag_id: string;

  @Column()
  name: string;

  @Column()
  status: string;

  @Column()
  equip_pic: string;

  @Column({ nullable: true })
  duration: number;

  @ManyToOne(() => TypeEquipment, (type) => type.equipment)
  type: TypeEquipment;

  @ManyToOne(() => Locker, (locker) => locker.equipment)
  locker: Locker;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => User, { nullable: true })
  @JoinColumn({
    name: 'created_by',
    referencedColumnName: 'id',
  })
  created_by: User;

  @ManyToOne((type) => User, { nullable: true })
  @JoinColumn({
    name: 'updated_by',
    referencedColumnName: 'id',
  })
  updated_by: User;

  @OneToMany(() => BorrowReturn, (borrowReturn) => borrowReturn.equipment)
  borrowReturns: BorrowReturn[];

  @OneToMany(() => Repair, (repair) => repair.equipment)
  repairs: Repair[];

  @OneToMany(() => Report, (report) => report.equipment)
  reports: Report[];
}
