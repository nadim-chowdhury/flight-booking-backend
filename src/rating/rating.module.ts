import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { Rating } from '../entities/rating.entity';
import { User } from '../entities/user.entity';
import { Flight } from '../entities/flight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, User, Flight])],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
