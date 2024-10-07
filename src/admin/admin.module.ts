// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AdminController } from './admin.controller';
// import { AdminService } from './admin.service';
// import { Booking } from '../entities/booking.entity';
// import { User } from '../entities/user.entity';
// import { Flight } from '../entities/flight.entity';
// import { Payment } from '../entities/payment.entity';
// import { FlightService } from '../flight/flight.service';
// import { UserService } from '../user/user.service';
// import { AuthModule } from 'src/auth/auth.module';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Booking, User, Flight, Payment]),
//     AuthModule,
//   ],
//   controllers: [AdminController],
//   providers: [AdminService, FlightService, UserService],
//   exports: [AdminService],
// })
// export class AdminModule {}

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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: User.name, schema: UserSchema },
      { name: Flight.name, schema: FlightSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, FlightService, UserService],
  exports: [AdminService],
})
export class AdminModule {}
