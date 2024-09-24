import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('airports')
export class Airport {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the airport',
  })
  id: number;

  @Column({ length: 255 })
  @ApiProperty({
    example: 'Hartsfield-Jackson Atlanta International Airport',
    description: 'The name of the airport',
  })
  name: string;

  @Column({ length: 255 })
  @ApiProperty({
    example: 'Atlanta',
    description: 'The city where the airport is located',
  })
  city: string;

  @Column({ length: 255 })
  @ApiProperty({
    example: 'United States',
    description: 'The country where the airport is located',
  })
  country: string;

  @Column({ length: 3, nullable: true })
  @ApiProperty({ example: 'ATL', description: 'IATA code of the airport' })
  iata: string;

  @Column({ length: 4, nullable: true })
  @ApiProperty({ example: 'KATL', description: 'ICAO code of the airport' })
  icao: string;

  @Column('decimal')
  @ApiProperty({ example: 33.6367, description: 'Latitude of the airport' })
  latitude: number;

  @Column('decimal')
  @ApiProperty({ example: -84.4281, description: 'Longitude of the airport' })
  longitude: number;

  @Column('int')
  @ApiProperty({
    example: 1026,
    description: 'Altitude of the airport in feet',
  })
  altitude: number;

  @Column('int', { nullable: true })
  @ApiProperty({ example: -5, description: 'Timezone offset from UTC' })
  timezone: number;

  @Column({ type: 'char', length: 1, nullable: true })
  @ApiProperty({
    example: 'E',
    description:
      'Daylight saving time status (E: Europe, A: US/Canada, S: South America, etc.)',
  })
  dst: string;

  @Column({ length: 50, nullable: true })
  @ApiProperty({ example: 'America/New_York', description: 'Timezone name' })
  tz: string;

  @Column({ length: 50 })
  @ApiProperty({ example: 'airport', description: 'Type of the location' })
  type: string;

  @Column({ length: 50 })
  @ApiProperty({
    example: 'OurAirports',
    description: 'Source of the information',
  })
  source: string;
}
