import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './booking.entity';
import { User } from '../entities/user.entity';
import { Flight } from '../entities/flight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, Flight])],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}

//  import { Module } from '@nestjs/common';
//  import { TypeOrmModule } from '@nestjs/typeorm';
//  import { Booking } from './booking.entity';
//  import { BookingService } from './booking.service';
//  import { BookingController } from './booking.controller';

//  @Module({
//    imports: [TypeOrmModule.forFeature([Booking])],
//    providers: [BookingService],
//    controllers: [BookingController],
//  })
//  export class BookingModule {}
