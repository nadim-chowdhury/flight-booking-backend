import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Add this line
import { Booking } from './booking.entity';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'The unique ID of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'The hashed password of the user' })
  @Column()
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
    required: false,
  })
  @Column({ nullable: true })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
    required: false,
  })
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'Profile picture URL',
    required: false,
  })
  @Column({ nullable: true })
  profilePicture: string;

  @ApiProperty({
    example: 'user',
    description: 'The role of the user',
    default: 'user',
  })
  @Column({ default: 'user' })
  role: string;

  // One-to-Many relationship with Booking (a user can have many bookings)
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
