import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from '../entities/booking.entity'; // Ensure correct path
import { Flight } from '../entities/flight.entity';
import { Passenger } from '../entities/passenger.entity'; // Include Passenger entity

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Flight, Passenger])],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
