// import { Injectable, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Payment } from '../entities/payment.entity';
// import { User } from '../entities/user.entity';
// import { ConfigService } from '@nestjs/config';
// import Stripe from 'stripe';
// import { Booking } from 'src/entities/booking.entity';

// @Injectable()
// export class PaymentService {
//   private stripe: Stripe;

//   constructor(
//     @InjectRepository(Payment)
//     private paymentRepository: Repository<Payment>,
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     @InjectRepository(Booking)
//     private bookingRepository: Repository<Booking>,
//     private configService: ConfigService,
//   ) {
//     this.stripe = new Stripe(
//       this.configService.get<string>('STRIPE_SECRET_KEY'),
//       {
//         apiVersion: '2024-06-20',
//       },
//     );
//   }

//   async processPayment(
//     userId: number,
//     bookingId: number,
//     token: string,
//   ): Promise<Payment> {
//     // Fetch the user with the given ID
//     const user = await this.userRepository.findOne({
//       where: { id: userId },
//     });
//     if (!user) {
//       throw new BadRequestException(`User with ID ${userId} not found`);
//     }

//     // Fetch the booking with the given ID
//     const booking = await this.bookingRepository.findOne({
//       where: { id: bookingId },
//     });
//     if (!booking) {
//       throw new BadRequestException(`Booking with ID ${bookingId} not found`);
//     }

//     const amount = 1000; // Amount in cents
//     const currency = 'usd';

//     // Create a charge with Stripe
//     const charge = await this.stripe.charges.create({
//       amount,
//       currency,
//       source: token,
//       description: `Payment for booking ${bookingId}`,
//       receipt_email: user.email,
//     });

//     // Create a new Payment entity
//     const payment = this.paymentRepository.create({
//       stripePaymentId: charge.id,
//       amount,
//       currency,
//       status: charge.status,
//       user,
//       booking,
//       createdAt: new Date(),
//     });

//     // Save the payment in the database
//     return this.paymentRepository.save(payment);
//   }

//   async getPaymentHistory(userId: number): Promise<Payment[]> {
//     return this.paymentRepository.find({
//       where: { user: { id: userId } },
//       relations: ['booking'],
//       order: { createdAt: 'DESC' },
//     });
//   }
// }

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from '../schemas/payment.schema';
import { User } from '../schemas/user.schema';
import { Booking } from '../schemas/booking.schema';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2024-06-20',
      },
    );
  }

  async processPayment(
    userId: string, // Updated to string for MongoDB ObjectId
    bookingId: string, // Updated to string for MongoDB ObjectId
    token: string,
  ): Promise<Payment> {
    // Fetch the user with the given ID
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }

    // Fetch the booking with the given ID
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      throw new BadRequestException(`Booking with ID ${bookingId} not found`);
    }

    const amount = 1000; // Amount in cents
    const currency = 'usd';

    // Create a charge with Stripe
    const charge = await this.stripe.charges.create({
      amount,
      currency,
      source: token,
      description: `Payment for booking ${bookingId}`,
      receipt_email: user.email,
    });

    // Create a new Payment document
    const payment = new this.paymentModel({
      stripePaymentId: charge.id,
      amount,
      currency,
      status: charge.status,
      user: userId,
      booking: bookingId,
      createdAt: new Date(),
    });

    // Save the payment in the database
    return payment.save();
  }

  async getPaymentHistory(userId: string): Promise<Payment[]> {
    return this.paymentModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();
  }
}
