import { PartialType } from '@nestjs/mapped-types';
import { CreateFlightDto } from './create-flight.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFlightDto extends PartialType(CreateFlightDto) {
  @ApiPropertyOptional({
    example: 'Airline XYZ',
    description: 'Updated name of the airline',
  })
  airline?: string;

  @ApiPropertyOptional({
    example: 'JFK',
    description: 'Updated departure airport code',
  })
  departure?: string;

  @ApiPropertyOptional({
    example: 'LAX',
    description: 'Updated arrival airport code',
  })
  arrival?: string;

  @ApiPropertyOptional({
    example: '2024-09-30T12:00:00Z',
    description: 'Updated departure time',
  })
  departureTime?: Date;

  @ApiPropertyOptional({
    example: '2024-09-30T15:00:00Z',
    description: 'Updated arrival time',
  })
  arrivalTime?: Date;

  @ApiPropertyOptional({
    example: 300,
    description: 'Updated price of the flight',
  })
  price?: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Updated number of available seats',
  })
  availability?: number;
}
