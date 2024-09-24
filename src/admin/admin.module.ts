import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity';
import { Flight } from '../entities/flight.entity';
import { Payment } from '../entities/payment.entity';
import { FlightService } from '../flight/flight.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, Flight, Payment])],
  controllers: [AdminController],
  providers: [AdminService, FlightService, UserService],
  exports: [AdminService],
})
export class AdminModule {}
