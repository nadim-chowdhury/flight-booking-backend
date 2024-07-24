import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificationModule } from './notification/notification.module';
import { ReviewModule } from './review/review.module';
import { RatingModule } from './rating/rating.module';
import { PaymentModule } from './payment/payment.module';
import { AdminModule } from './admin/admin.module';
import { BookingModule } from './booking/booking.module';
import { FlightModule } from './flight/flight.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AdminModule,
    AuthModule,
    BookingModule,
    FlightModule,
    NotificationModule,
    PaymentModule,
    RatingModule,
    ReviewModule,
    UserModule,
  ],
})
export class AppModule {}

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';
// import { UserModule } from './user/user.module';
// import { FlightModule } from './flight/flight.module';
// import { BookingModule } from './booking/booking.module';
// import { PaymentModule } from './payment/payment.module';
// import { User } from './user/user.entity';
// import { Flight } from './flight/flight.entity';
// import { Booking } from './booking/booking.entity';
// import { Payment } from './payment/payment.entity';

// @Module({
//   imports: [
//     ConfigModule.forRoot(),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DATABASE_HOST,
//       port: parseInt(process.env.DATABASE_PORT, 10),
//       username: process.env.DATABASE_USERNAME,
//       password: process.env.DATABASE_PASSWORD,
//       database: process.env.DATABASE_NAME,
//       entities: [User, Flight, Booking, Payment],
//       synchronize: true,
//     }),
//     AuthModule,
//     UserModule,
//     FlightModule,
//     BookingModule,
//     PaymentModule,
//   ],
// })
// export class AppModule {}
