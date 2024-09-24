import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { User } from './entities/user.entity';
import { Flight } from './entities/flight.entity';
import { Booking } from './entities/booking.entity';
import { Payment } from './entities/payment.entity';
import { Passenger } from './entities/passenger.entity';
import { Airline } from './entities/airlines.entity';
import { Airport } from './entities/airports.entity';
import { Plane } from './entities/planes.entity';
import { Route } from './entities/routes.entity';
import { Country } from './entities/countries.entity';

import { AirlinesModule } from './airlines/airlines.module';
import { AirportsModule } from './airports/airports.module';
import { CountriesModule } from './countries/countries.module';
import { PlanesModule } from './planes/planes.module';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Flight,
        Booking,
        Payment,
        Passenger,
        Airline,
        Airport,
        Plane,
        Route,
        Country,
      ],
      synchronize: true,

      ssl: process.env.DATABASE_SSL === 'true',
      extra: {
        ssl:
          process.env.DATABASE_SSL === 'true'
            ? { rejectUnauthorized: false }
            : false,
      },
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    AirlinesModule,
    AirportsModule,
    CountriesModule,
    PlanesModule,
    RoutesModule,
  ],
})
export class AppModule {}
