import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from '../user/user.entity';
import { Flight } from '../flight/flight.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { flightId, userId } = createBookingDto;

    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const flight = await this.flightRepository.findOne(flightId);
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${flightId} not found`);
    }

    const booking = this.bookingRepository.create({
      user,
      flight,
      bookingDate: new Date(),
      status: 'CONFIRMED',
    });

    await this.bookingRepository.save(booking);
    // Add email confirmation logic here

    return booking;
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['flight'],
    });
  }
}

// src/booking/booking.service.ts (inside createBooking method)
// import * as nodemailer from 'nodemailer';

// async function sendBookingConfirmation(email: string, booking: Booking) {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.example.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: 'your_email@example.com',
//       pass: 'your_email_password',
//     },
//   });

//   const mailOptions = {
//     from: 'your_email@example.com',
//     to: email,
//     subject:

//  'Booking Confirmation',
//     text: `Your booking is confirmed. Booking details: ${JSON.stringify(booking)}`,
//   };

//   await transporter.sendMail(mailOptions);
// }

// // Call this function after saving the booking
// await this.bookingRepository.save(booking);
// await sendBookingConfirmation(user.email, booking);

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Booking } from './booking.entity';
// import { CreateBookingDto } from './dto/create-booking.dto';
// import { User } from '../user/user.entity';
// import { Flight } from '../flight/flight.entity';
// import { NotificationService } from '../notification/notification.service';

// @Injectable()
// export class BookingService {
//   constructor(
//     @InjectRepository(Booking)
//     private bookingRepository: Repository<Booking>,
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     @InjectRepository(Flight)
//     private flightRepository: Repository<Flight>,
//     private notificationService: NotificationService,
//   ) {}

//   async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
//     const { flightId, userId } = createBookingDto;

//     const user = await this.userRepository.findOne(userId);
//     if (!user) {
//       throw new NotFoundException(`User with ID ${userId} not found`);
//     }

//     const flight = await this.flightRepository.findOne(flightId);
//     if (!flight) {
//       throw new NotFoundException(`Flight with ID ${flightId} not found`);
//     }

//     const booking = this.bookingRepository.create({
//       user,
//       flight,
//       bookingDate: new Date(),
//       status: 'CONFIRMED',
//     });

//     await this.bookingRepository.save(booking);

//     // Send notifications
//     await this.notificationService.sendBookingConfirmationEmail(
//       user.email,
//       booking,
//     );
//     if (user.phone) {
//       await this.notificationService.sendBookingConfirmationSms(
//         user.phone,
//         booking,
//       );
//     }

//     return booking;
//   }

//   async getBookingsByUserId(userId: number): Promise<Booking[]> {
//     return this.bookingRepository.find({
//       where: { user: { id: userId } },
//       relations: ['flight'],
//     });
//   }
// }

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Booking } from './booking.entity';

// @Injectable()
// export class BookingService {
//   constructor(
//     @InjectRepository(Booking)
//     private readonly bookingRepository: Repository<Booking>,
//   ) {}

//   findAll(): Promise<Booking[]> {
//     return this.bookingRepository.find({ relations: ['user', 'flight'] });
//   }

//   findOne(id: number): Promise<Booking> {
//     return this.bookingRepository.findOne(id, {
//       relations: ['user', 'flight'],
//     });
//   }

//   create(booking: Booking): Promise<Booking> {
//     return this.bookingRepository.save(booking);
//   }

//   update(id: number, booking: Booking): Promise<any> {
//     return this.bookingRepository.update(id, booking);
//   }

//   delete(id: number): Promise<any> {
//     return this.bookingRepository.delete(id);
//   }
// }
