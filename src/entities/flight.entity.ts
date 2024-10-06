import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Unique ID of the flight' })
  id: number;

  @Column()
  @ApiProperty({
    example: 'Biman Bangladesh Airlines',
    description: 'Name of the airline',
  })
  airline: string;

  // @Column({ nullable: true })
  // @ApiProperty({ example: 'BG', description: 'IATA code of the airline' })
  // airlineCode: string; // Add airlineCode field here

  @Column()
  @ApiProperty({ example: 'DAC', description: 'Departure airport code' })
  from: string;

  @Column()
  @ApiProperty({ example: 'DXB', description: 'Arrival airport code' })
  to: string;

  @Column()
  @ApiProperty({ example: 100, description: 'Number of available seats' })
  availableSeats: number;

  @Column()
  @ApiProperty({
    example: '2024-10-31T19:00:00Z',
    description: 'Departure time of the flight',
  })
  departureTime: Date;

  @Column()
  @ApiProperty({
    example: '2024-11-01T00:30:00Z',
    description: 'Arrival time of the flight',
  })
  arrivalTime: Date;

  @Column('decimal')
  @ApiProperty({ example: 32175, description: 'Price of the flight' })
  price: number;

  @Column()
  @ApiProperty({
    example: '7 hours 30 minutes',
    description: 'Flight duration',
  })
  duration: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'BG-147', description: 'Flight number' })
  flightNumber: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'Boeing 777-300', description: 'Equipment type' })
  equipmentType: string;

  @Column({ nullable: true })
  @ApiProperty({
    example: 'Yes',
    description: 'Electronic ticketing available',
  })
  electronicTicketing: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'Economy', description: 'Cabin class' })
  cabinClass: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'TBDAPO', description: 'Fare basis' })
  fareBasis: string;

  @Column({ nullable: true })
  @ApiProperty({
    example: 'Technical Stopover at CGP',
    description: 'Technical stop information',
    required: false,
  })
  techstop?: string;

  // New fields for detailed departure information
  @Column({ type: 'json', nullable: true })
  @ApiProperty({
    example: {
      airportName: 'Hazrat Shahjalal International Airport',
      city: 'Dhaka',
      country: 'Bangladesh',
      terminal: 'T1',
    },
    description: 'Detailed departure information',
  })
  departure: {
    airportName: string;
    city: string;
    country: string;
    terminal?: string;
  };

  // New fields for detailed arrival information
  @Column({ type: 'json', nullable: true })
  @ApiProperty({
    example: {
      airportName: 'Dubai International Airport',
      city: 'Dubai',
      country: 'UAE',
      terminal: 'T3',
    },
    description: 'Detailed arrival information',
  })
  arrival: {
    airportName: string;
    city: string;
    country: string;
    terminal?: string;
  };

  // One-to-Many relationship with Booking (a flight can have many bookings)
  @OneToMany(() => Booking, (booking) => booking.flight)
  bookings: Booking[];
}
