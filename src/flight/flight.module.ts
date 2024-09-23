import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { Flight } from 'src/entities/flight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flight])],
  providers: [FlightService],
  controllers: [FlightController],
  exports: [FlightService],
})
export class FlightModule {}
