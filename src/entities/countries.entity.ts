import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('countries')
export class Country {
  @PrimaryColumn({ length: 2 })
  @ApiProperty({
    example: 'US',
    description: 'The ISO 3166-1 alpha-2 country code',
  })
  code: string;

  @Column({ length: 255 })
  @ApiProperty({
    example: 'United States',
    description: 'The name of the country',
  })
  name: string;

  @Column({ length: 255, nullable: true })
  @ApiProperty({
    example: 'USA',
    description: 'An optional additional code for the country',
    nullable: true,
  })
  additional_code: string;
}
