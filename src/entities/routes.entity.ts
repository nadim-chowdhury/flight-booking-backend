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

  @Column({ length: 10 })
  @ApiProperty({ example: 'QR', description: 'Airline code (IATA or ICAO)' })
  airline_code: string;

  @Column('int', { nullable: true })
  @ApiProperty({
    example: 157,
    description: 'Airline ID associated with the route',
  })
  airline_id: number;

  @Column({ length: 10 })
  @ApiProperty({ example: 'ATL', description: 'Source airport code (IATA)' })
  source_airport: string;

  @Column('int', { nullable: true })
  @ApiProperty({ example: 347, description: 'Source airport ID' })
  source_airport_id: number;

  @Column({ length: 10 })
  @ApiProperty({
    example: 'DOH',
    description: 'Destination airport code (IATA)',
  })
  destination_airport: string;

  @Column('int', { nullable: true })
  @ApiProperty({ example: 348, description: 'Destination airport ID' })
  destination_airport_id: number;

  @Column({ length: 10, nullable: true })
  @ApiProperty({
    example: 'Y',
    description: 'Codeshare status',
    nullable: true,
  })
  codeshare: string;

  @Column('int')
  @ApiProperty({ example: 0, description: 'Number of stops in the route' })
  stops: number;

  @Column({ length: 10, nullable: true })
  @ApiProperty({ example: '747', description: 'Equipment used for the route' })
  equipment: string;
}
