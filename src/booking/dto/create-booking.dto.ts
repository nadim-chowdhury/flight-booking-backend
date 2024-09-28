import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 1, description: 'ID of the flight being booked' })
  flightId: number;

  @ApiProperty({ example: 1, description: 'ID of the passenger' })
  passengerId: number;

  @ApiProperty({ example: 2, description: 'Number of seats being booked' })
  numberOfSeats: number;
}
