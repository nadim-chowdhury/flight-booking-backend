import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('airlines')
export class Airline {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the airline',
  })
  id: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'Qatar Airways',
    description: 'The name of the airline',
  })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'QA',
    description: 'The alias of the airline',
    nullable: true,
  })
  alias: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'QR',
    description: 'IATA code of the airline',
    nullable: true,
  })
  iata: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'QTR',
    description: 'ICAO code of the airline',
    nullable: true,
  })
  icao: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'Qatar',
    description: 'The callsign of the airline',
    nullable: true,
  })
  callsign: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'Qatar',
    description: 'The country of origin for the airline',
    nullable: true,
  })
  country: string;

  @Column({ type: 'char', length: 1 })
  @ApiProperty({
    example: 'Y',
    description: 'Is the airline currently active (Y/N)',
  })
  active: string;
}
