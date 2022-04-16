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
import { Floor } from './floor.entity';

@Entity()
export class Building {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Floor, (floor) => floor.building)
  floors: Floor[];

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
