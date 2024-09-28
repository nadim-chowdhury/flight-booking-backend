import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchFlightDto {
  @ApiProperty({ example: 'JFK', description: 'Departure airport code' })
  from: string;

  @ApiProperty({ example: 'LAX', description: 'Arrival airport code' })
  to: string;

  @ApiProperty({
    example: '2024-09-30T00:00:00Z',
    description: 'Departure date of the flight',
  })
  departureDate: Date;

  @ApiPropertyOptional({
    example: '2024-10-07T00:00:00Z',
    description: 'Optional return date',
  })
  returnDate?: Date;
}
