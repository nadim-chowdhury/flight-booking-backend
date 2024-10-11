// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Flight } from '../entities/flight.entity';
// import { Passenger } from '../entities/passenger.entity';
// import { Booking } from 'src/entities/booking.entity';
// import { CreateBookingDto } from './dto/create-booking.dto';

// @Injectable()
// export class BookingService {
//   constructor(
//     @InjectRepository(Booking)
//     private bookingRepository: Repository<Booking>,
//     @InjectRepository(Flight)
//     private flightRepository: Repository<Flight>,
//     @InjectRepository(Passenger)
//     private passengerRepository: Repository<Passenger>,
//   ) {}

//   async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
//     const { flightId, passengerId, numberOfSeats } = createBookingDto;

//     // Fetch the flight with the given ID using where clause
//     const flight = await this.flightRepository.findOne({
//       where: { id: flightId },
//     });
//     if (!flight) {
//       throw new NotFoundException(`Flight with ID ${flightId} not found`);
//     }

//     // Fetch the passenger with the given ID using where clause
//     const passenger = await this.passengerRepository.findOne({
//       where: { id: passengerId },
//     });
//     if (!passenger) {
//       throw new NotFoundException(`Passenger with ID ${passengerId} not found`);
//     }

//     // Check if there are enough available seats
//     if (flight.availableSeats < numberOfSeats) {
//       throw new NotFoundException('Not enough seats available');
//     }

//     const totalPrice = flight.price * numberOfSeats;
//     flight.availableSeats -= numberOfSeats;
//     await this.flightRepository.save(flight);

//     // Create a new booking entity
//     const booking = this.bookingRepository.create({
//       flight,
//       passenger,
//       numberOfSeats,
//       totalPrice,
//       bookingDate: new Date(),
//     });

//     // Save the booking in the database
//     return this.bookingRepository.save(booking);
//   }

//   async getBooking(id: number): Promise<Booking> {
//     // Use where clause for findOne
//     const booking = await this.bookingRepository.findOne({
//       where: { id },
//     });
//     if (!booking) {
//       throw new NotFoundException(`Booking with ID ${id} not found`);
//     }
//     return booking;
//   }

//   async getBookings(): Promise<Booking[]> {
//     return this.bookingRepository.find({ relations: ['flight', 'passenger'] });
//   }

//   async deleteBooking(id: number): Promise<void> {
//     const result = await this.bookingRepository.delete(id);
//     if (result.affected === 0) {
//       throw new NotFoundException(`Booking with ID ${id} not found`);
//     }
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../schemas/booking.schema';
import { Flight } from '../schemas/flight.schema';
import { Passenger } from '../schemas/passenger.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Flight.name) private flightModel: Model<Flight>,
    @InjectModel(Passenger.name) private passengerModel: Model<Passenger>,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { flightId, passengerId, numberOfSeats } = createBookingDto;

    // Fetch the flight with the given ID using Mongoose's `findById`
    const flight = await this.flightModel.findById(flightId);
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${flightId} not found`);
    }

    // Fetch the passenger with the given ID using Mongoose's `findById`
    const passenger = await this.passengerModel.findById(passengerId);
    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${passengerId} not found`);
    }

    // Check if there are enough available seats
    // if (flight.availableSeats < numberOfSeats) {
    //   throw new NotFoundException('Not enough seats available');
    // }

    // const totalPrice = flight.price * numberOfSeats;
    // flight.availableSeats -= numberOfSeats;
    // await flight.save(); // Save the updated flight document

    // Create a new booking document
    const booking = new this.bookingModel({
      flight,
      passenger,
      numberOfSeats,
      totalPrice: Math.floor(Math.random() * 10000),
      bookingDate: new Date(),
    });

    // Save the booking in the database
    return booking.save();
  }

  async getBooking(id: string): Promise<Booking> {
    // Use Mongoose's `findById`
    const booking = await this.bookingModel
      .findById(id)
      .populate('flight passenger')
      .exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async getBookings(): Promise<Booking[]> {
    return this.bookingModel.find().populate('flight passenger').exec();
  }

  async deleteBooking(id: string): Promise<void> {
    const result = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }
}
