import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { FlightService } from './flight.service';
import { SearchFlightDto } from './dto/search-flight.dto';
import { Flight } from 'src/entities/flight.entity';

@Controller('flights')
export class FlightController {
  constructor(private flightService: FlightService) {}

  @Get()
  searchFlights(@Query() searchFlightDto: SearchFlightDto) {
    return this.flightService.searchFlights(searchFlightDto);
  }

  @Get(':id')
  getFlightById(@Param('id') id: number) {
    return this.flightService.getFlightById(id);
  }

  @Post()
  createFlight(@Body() flight: Flight) {
    return this.flightService.createFlight(flight);
  }

  @Put(':id')
  updateFlight(@Param('id') id: number, @Body() flight: Partial<Flight>) {
    return this.flightService.updateFlight(id, flight);
  }

  @Delete(':id')
  deleteFlight(@Param('id') id: number) {
    return this.flightService.deleteFlight(id);
  }
}
