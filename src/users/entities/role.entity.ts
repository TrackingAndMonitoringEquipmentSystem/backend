import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MASTER_MAINTAINER = 'master_maintainer',
  MAINTAINER = 'maintainer',
  USER = 'user',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ type: 'simple-json' })
  permission: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
