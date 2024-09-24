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
import { CreateFlightDto } from './dto/create-flight.dto'; // Import CreateFlightDto
import { UpdateFlightDto } from './dto/update-flight.dto'; // Import UpdateFlightDto

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
  createFlight(@Body() createFlightDto: CreateFlightDto) {
    // Use CreateFlightDto as the input type for creating a flight
    return this.flightService.createFlight(createFlightDto);
  }

  @Put(':id')
  updateFlight(
    @Param('id') id: number,
    @Body() updateFlightDto: UpdateFlightDto, // Use UpdateFlightDto for updates
  ) {
    return this.flightService.updateFlight(id, updateFlightDto);
  }

  @Delete(':id')
  deleteFlight(@Param('id') id: number) {
    return this.flightService.deleteFlight(id);
  }
}
