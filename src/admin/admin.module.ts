import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Booking, BookingSchema } from '../schemas/booking.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Flight, FlightSchema } from '../schemas/flight.schema';
import { Payment, PaymentSchema } from '../schemas/payment.schema';
import { FlightService } from '../flight/flight.service';
import { UserService } from '../user/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { AmadeusModule } from 'src/amadeus/amadeus.module'; // Import AmadeusModule
import {
  BookFlight,
  FlightSchema as BookFlightSchema,
} from '../schemas/book-flight.schema'; // BookFlight schema

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: User.name, schema: UserSchema },
      { name: Flight.name, schema: FlightSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: BookFlight.name, schema: BookFlightSchema },
    ]),
    AuthModule,
    AmadeusModule, // Ensure AmadeusModule is imported here
  ],
  controllers: [AdminController],
  providers: [AdminService, FlightService, UserService],
  exports: [AdminService],
})
export class AdminModule {}
