import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.createBooking(createBookingDto);
  }

  @Get(':userId')
  getBookingsByUserId(@Param('userId') userId: number) {
    return this.bookingService.getBookingsByUserId(userId);
  }
}

// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Body,
//   Param,
// } from '@nestjs/common';
// import { BookingService } from './booking.service';
// import { Booking } from './booking.entity';

// @Controller('bookings')
// export class BookingController {
//   constructor(private readonly bookingService: BookingService) {}

//   @Get()
//   findAll(): Promise<Booking[]> {
//     return this.bookingService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: number): Promise<Booking> {
//     return this.bookingService.findOne(id);
//   }

//   @Post()
//   create(@Body() booking: Booking): Promise<Booking> {
//     return this.bookingService.create(booking);
//   }

//   @Put(':id')
//   update(@Param('id') id: number, @Body() booking: Booking): Promise<any> {
//     return this.bookingService.update(id, booking);
//   }

//   @Delete(':id')
//   delete(@Param('id') id: number): Promise<any> {
//     return this.bookingService.delete(id);
//   }
// }
