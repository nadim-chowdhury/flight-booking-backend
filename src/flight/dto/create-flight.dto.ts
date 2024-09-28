import { ApiProperty } from '@nestjs/swagger';

export class CreateFlightDto {
  @ApiProperty({ example: 'Airline XYZ', description: 'Name of the airline' })
  airline: string;

  @ApiProperty({ example: 'JFK', description: 'Departure airport code' })
  departure: string;

  @ApiProperty({ example: 'LAX', description: 'Arrival airport code' })
  arrival: string;

  @ApiProperty({
    example: '2024-09-30T12:00:00Z',
    description: 'Departure time of the flight',
  })
  departureTime: Date;

  @ApiProperty({
    example: '2024-09-30T15:00:00Z',
    description: 'Arrival time of the flight',
  })
  arrivalTime: Date;

  @ApiProperty({ example: 300, description: 'Price of the flight' })
  price: number;

  @ApiProperty({ example: 100, description: 'Number of available seats' })
  availability: number;
}
