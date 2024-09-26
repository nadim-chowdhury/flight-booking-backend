import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier for the country',
  })
  id: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'US',
    description: 'The ISO 3166-1 alpha-2 country code',
  })
  code: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'United States',
    description: 'The name of the country',
  })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'USA',
    description: 'An optional additional code for the country',
    nullable: true,
  })
  additional_code: string;
}
