import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ example: 1, description: 'ID of the user giving the rating' })
  userId: number;

  @ApiProperty({ example: 1, description: 'ID of the flight being rated' })
  flightId: number;

  @ApiProperty({
    example: 5,
    description: 'Rating score (1 to 5)',
    minimum: 1,
    maximum: 5,
  })
  score: number;
}
