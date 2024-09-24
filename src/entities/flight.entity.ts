import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  airline: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  availableSeats: number;

  @Column()
  departureTime: Date;

  @Column()
  arrivalTime: Date;

  @Column('decimal')
  price: number;

  @Column()
  duration: string;

  // One-to-Many relationship with Booking (a flight can have many bookings)
  @OneToMany(() => Booking, (booking) => booking.flight)
  bookings: Booking[];
}
