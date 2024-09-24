import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('planes')
export class Plane {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the plane',
  })
  id: number;

  @Column({ length: 255, nullable: true })
  @ApiProperty({ example: 'Boeing 747', description: 'The name of the plane' })
  name: string;

  @Column({ length: 10, nullable: true })
  @ApiProperty({ example: 'B747', description: 'The code of the plane' })
  code: string;

  @Column({ length: 10, nullable: true })
  @ApiProperty({
    example: 'B747-8',
    description: 'The additional code of the plane',
    nullable: true,
  })
  additional_code: string;
}
