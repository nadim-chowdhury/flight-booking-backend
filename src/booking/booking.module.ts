// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { BookingService } from './booking.service';
// import { BookingController } from './booking.controller';
// import { Booking } from '../entities/booking.entity'; // Ensure correct path
// import { Flight } from '../entities/flight.entity';
// import { Passenger } from '../entities/passenger.entity'; // Include Passenger entity

// @Module({
//   imports: [TypeOrmModule.forFeature([Booking, Flight, Passenger])],
//   providers: [BookingService],
//   controllers: [BookingController],
//   exports: [BookingService],
// })
// export class BookingModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking, BookingSchema } from '../schemas/booking.schema';
import { Flight, FlightSchema } from '../schemas/flight.schema';
import {
  Passenger,
  PassengerSchema,
} from '../schemas/passenger.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Flight.name, schema: FlightSchema },
      { name: Passenger.name, schema: PassengerSchema },
    ]),
  ],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
