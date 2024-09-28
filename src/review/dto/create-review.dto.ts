import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 1, description: 'ID of the user giving the review' })
  userId: number;

  @ApiProperty({ example: 1, description: 'ID of the flight being reviewed' })
  flightId: number;

  @ApiProperty({
    example: 'Great flight, had a wonderful experience!',
    description: 'Content of the review',
  })
  content: string;
}
