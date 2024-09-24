import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FlightService } from '../flight/flight.service';
import { UserService } from '../user/user.service';
import { CreateFlightDto } from '../flight/dto/create-flight.dto';
import { UpdateFlightDto } from '../flight/dto/update-flight.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly flightService: FlightService,
    private readonly userService: UserService,
  ) {}

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getOverview();
  }

  @Get('flights')
  async getFlights() {
    return this.flightService.getFlights();
  }

  @Post('flights')
  async createFlight(@Body() createFlightDto: CreateFlightDto) {
    return this.flightService.createFlight(createFlightDto);
  }

  @Put('flights/:id')
  async updateFlight(
    @Param('id') id: number,
    @Body() updateFlightDto: UpdateFlightDto,
  ) {
    return this.flightService.updateFlight(id, updateFlightDto);
  }

  @Delete('flights/:id')
  async deleteFlight(@Param('id') id: number) {
    return this.flightService.deleteFlight(id);
  }

  @Get('users')
  async getUsers() {
    return this.userService.getUsers();
  }

  @Put('users/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
