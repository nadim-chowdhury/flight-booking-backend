import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  profilePicture: string;

  // One-to-Many relationship with Booking (a user can make many bookings)
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
