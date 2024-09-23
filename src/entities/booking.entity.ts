import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Flight } from './flight.entity';
import { Passenger } from './passenger.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Flight, (flight) => flight.bookings)
  @JoinColumn({ name: 'flightId' })
  flight: Flight;

  @ManyToOne(() => Passenger, (passenger) => passenger.bookings)
  @JoinColumn({ name: 'passengerId' })
  passenger: Passenger;

  @Column()
  bookingDate: Date;

  @Column({ type: 'int' })
  numberOfSeats: number;

  @Column({ type: 'decimal' })
  totalPrice: number;

  @Column()
  status: string;
}
