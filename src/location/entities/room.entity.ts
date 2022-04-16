import { Locker } from 'src/lockers/entities/locker.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Floor } from './floor.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Floor, (floor) => floor.rooms)
  floor: Floor;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({
    name: 'created_by',
    referencedColumnName: 'id',
  })
  createdBy: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({
    name: 'updated_by',
    referencedColumnName: 'id',
  })
  updatedBy: User;

  @OneToMany(() => Locker, (locker) => locker.room)
  lockers: Locker[];
}
