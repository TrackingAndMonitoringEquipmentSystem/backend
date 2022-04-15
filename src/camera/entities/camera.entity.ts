import { Locker } from 'src/lockers/entities/locker.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Camera {
  @PrimaryGeneratedColumn()
  camera_id: number;

  @Column()
  name: string;

  @Column()
  recent_picture: string;

  @ManyToOne(() => Locker, (locker) => locker.cameras)
  locker: Locker;
}
