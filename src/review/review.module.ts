import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from '../entities/review.entity';
import { User } from '../entities/user.entity';
import { Flight } from '../entities/flight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Flight])],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
