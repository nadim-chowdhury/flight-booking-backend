import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from 'src/entities/booking.entity';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async getAllBookings(): Promise<Booking[]> {
    return this.bookingService.getBookings();
  }

  @Get(':id')
  async getBookingById(@Param('id') id: number): Promise<Booking> {
    const booking = await this.bookingService.getBooking(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    return this.bookingService.createBooking(createBookingDto);
  }

  @Delete(':id')
  async deleteBooking(@Param('id') id: number): Promise<void> {
    return this.bookingService.deleteBooking(id);
  }
}
