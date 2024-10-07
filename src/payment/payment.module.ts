// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { PaymentService } from './payment.service';
// import { PaymentController } from './payment.controller';
// import { Payment } from '../entities/payment.entity';
// import { User } from '../entities/user.entity';
// import { ConfigModule } from '@nestjs/config';
// import { Booking } from 'src/entities/booking.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Payment, User, Booking]), ConfigModule],
//   providers: [PaymentService],
//   controllers: [PaymentController],
//   exports: [PaymentService],
// })
// export class PaymentModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment, PaymentSchema } from '../schemas/payment.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Booking, BookingSchema } from '../schemas/booking.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    ConfigModule,
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
