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
import { Building } from './building.entity';
import { Room } from './room.entity';

@Entity()
export class Floor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Room, (room) => room.floor)
  rooms: Room[];

  @ManyToOne(() => Building, (building) => building.floors)
  building: Building;

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
}
