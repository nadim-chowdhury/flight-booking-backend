import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the route',
  })
  id: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ example: 'QR', description: 'Airline code (IATA or ICAO)' })
  airline_code: string;

  @Column('int', { nullable: true })
  @ApiProperty({
    example: 157,
    description: 'Airline ID associated with the route',
  })
  airline_id: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ example: 'ATL', description: 'Source airport code (IATA)' })
  departure_airport: string;

  @Column('int', { nullable: true })
  @ApiProperty({ example: 347, description: 'Source airport ID' })
  departure_airport_id: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'DOH',
    description: 'Destination airport code (IATA)',
  })
  arrival_airport: string;

  @Column('int', { nullable: true })
  @ApiProperty({ example: 348, description: 'Destination airport ID' })
  arrival_airport_id: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'Y',
    description: 'Codeshare status',
    nullable: true,
  })
  codeshare: string;

  @Column('int')
  @ApiProperty({ example: 0, description: 'Number of stops in the route' })
  stops: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ example: '747', description: 'Equipment used for the route' })
  equipment: string;

  @Column({ type: 'text', nullable: true }) // Added flight_number
  @ApiProperty({ example: 'QR157', description: 'Flight number' })
  flight_number: string; // Added flight_number property
}
