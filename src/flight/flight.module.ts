import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { Flight, FlightSchema } from '../schemas/flight.schema';
import { AmadeusModule } from 'src/amadeus/amadeus.module'; // Import AmadeusModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Flight.name, schema: FlightSchema }]),
    AmadeusModule, // Use AmadeusModule to provide AmadeusService
  ],
  providers: [FlightService],
  controllers: [FlightController],
  exports: [FlightService],
})
export class FlightModule {}
