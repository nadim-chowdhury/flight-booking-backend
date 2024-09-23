import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from '../entities/flight.entity';
import { Passenger } from '../entities/passenger.entity';
import { Booking } from 'src/entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { flightId, passengerId, numberOfSeats } = createBookingDto;

    const flight = await this.flightRepository.findOne(flightId);
    const passenger = await this.passengerRepository.findOne(passengerId);

    if (!flight) {
      throw new NotFoundException(`Flight with ID ${flightId} not found`);
    }
    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${passengerId} not found`);
    }
    if (flight.availableSeats < numberOfSeats) {
      throw new NotFoundException('Not enough seats available');
    }

    const totalPrice = flight.price * numberOfSeats;
    flight.availableSeats -= numberOfSeats;
    await this.flightRepository.save(flight);

    const booking = this.bookingRepository.create({
      flight,
      passenger,
      numberOfSeats,
      totalPrice,
      bookingDate: new Date(),
    });

    return this.bookingRepository.save(booking);
  }

  async getBooking(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne(id, {
      relations: ['flight', 'passenger'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async getBookings(): Promise<Booking[]> {
    return this.bookingRepository.find({ relations: ['flight', 'passenger'] });
  }

  async deleteBooking(id: number): Promise<void> {
    const result = await this.bookingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }
}
