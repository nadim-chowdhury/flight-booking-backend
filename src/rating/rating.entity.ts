import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { Flight } from '../entities/flight.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Flight)
  @JoinColumn({ name: 'flightId' })
  flight: Flight;
}
