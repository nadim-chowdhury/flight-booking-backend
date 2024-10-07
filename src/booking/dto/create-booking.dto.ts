// import { ApiProperty } from '@nestjs/swagger';

// export class CreateBookingDto {
//   @ApiProperty({ example: 1, description: 'ID of the flight being booked' })
//   flightId: number;

//   @ApiProperty({ example: 1, description: 'ID of the passenger' })
//   passengerId: number;

//   @ApiProperty({ example: 2, description: 'Number of seats being booked' })
//   numberOfSeats: number;
// }

import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    example: '610c0f8e8f1b2c3d4e5f6789',
    description: 'ID of the flight being booked',
  })
  flightId: string;

  @ApiProperty({
    example: '610c0f8e8f1b2c3d4e5f6789',
    description: 'ID of the passenger',
  })
  passengerId: string;

  @ApiProperty({ example: 2, description: 'Number of seats being booked' })
  numberOfSeats: number;
}
