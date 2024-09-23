import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Importing feature modules
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { ReviewModule } from './review/review.module';
import { RatingModule } from './rating/rating.module';
import { PaymentModule } from './payment/payment.module';
import { AdminModule } from './admin/admin.module';
import { BookingModule } from './booking/booking.module';
import { FlightModule } from './flight/flight.module';

// Importing entities
import { User } from './entities/user.entity';
import { Flight } from './entities/flight.entity';
import { Booking } from './entities/booking.entity';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    // Load .env configuration
    ConfigModule.forRoot({
      isGlobal: true, // Make environment variables globally available
    }),

    // TypeORM configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Flight, Booking, Payment], // Register all entities
      synchronize: true, // Set to false in production
    }),

    // Serve static files (e.g., profile pictures, documents)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Location of static assets
      serveRoot: '/uploads', // URL path to serve these static files
    }),

    // Feature modules
    AuthModule,
    UserModule,
    NotificationModule,
    ReviewModule,
    RatingModule,
    PaymentModule,
    AdminModule,
    BookingModule,
    FlightModule,
  ],
})
export class AppModule {}
