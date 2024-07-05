import { Controller, Get, Query, Param } from '@nestjs/common';
import { FlightService } from './flight.service';
import { SearchFlightDto } from './dto/search-flight.dto';

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
}

// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Body,
//   Param,
// } from '@nestjs/common';
// import { FlightService } from './flight.service';
// import { Flight } from './flight.entity';

// @Controller('flights')
// export class FlightController {
//   constructor(private readonly flightService: FlightService) {}

//   @Get()
//   findAll(): Promise<Flight[]> {
//     return this.flightService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: number): Promise<Flight> {
//     return this.flightService.findOne(id);
//   }

//   @Post()
//   create(@Body() flight: Flight): Promise<Flight> {
//     return this.flightService.create(flight);
//   }

//   @Put(':id')
//   update(@Param('id') id: number, @Body() flight: Flight): Promise<any> {
//     return this.flightService.update(id, flight);
//   }

//   @Delete(':id')
//   delete(@Param('id') id: number): Promise<any> {
//     return this.flightService.delete(id);
//   }
// }

//  import {
//    Controller,
//    Get,
//    Post,
//    Put,
//    Delete,
//    Body,
//    Param,
//    UseGuards,
//  } from '@nestjs/common';
//  import { FlightService } from './flight.service';
//  import { Flight } from './flight.entity';
//  import { Roles } from '../auth/roles.decorator';
//  import { RolesGuard } from '../auth/roles.guard';
//  import { AuthGuard } from '@nestjs/passport';

//  @Controller('admin/flights')
//  @UseGuards(AuthGuard('jwt'), RolesGuard)
//  @Roles('admin')
//  export class AdminFlightController {
//    constructor(private readonly flightService: FlightService) {}

//    @Get()
//    findAll(): Promise<Flight[]> {
//      return this.flightService.findAll();
//    }

//    @Get(':id')
//    findOne(@Param('id') id: number): Promise<Flight> {
//      return this.flightService.findOne(id);
//    }

//    @Post()
//    create(@Body() flight: Flight): Promise<Flight> {
//      return this.flightService.create(flight);
//    }

//    @Put(':id')
//    update(@Param('id') id: number, @Body() flight: Flight): Promise<any> {
//      return this.flightService.update(id, flight);
//    }

//    @Delete(':id')
//    delete(@Param('id') id: number): Promise<any> {
//      return this.flightService.delete(id);
//    }
//  }
