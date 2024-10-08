import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { Passenger } from '../schemas/passenger.schema';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Passenger')
@Controller('passenger')
@UseGuards(JwtAuthGuard)
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new passenger',
    description:
      'Creates a new passenger with unique details such as passport number, name, etc.',
  })
  @ApiBody({
    type: CreatePassengerDto,
    description: 'The DTO to create a passenger',
  })
  @ApiResponse({ status: 201, description: 'Passenger created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or passenger already exists',
  })
  async createPassenger(@Body() createPassengerDto: CreatePassengerDto) {
    if (!createPassengerDto) {
      throw new BadRequestException('Passenger data is required');
    }
    return this.passengerService.createPassenger(createPassengerDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get passenger by ID',
    description: 'Fetches a passenger by their unique ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique passenger ID (24-character hex string)',
    example: '60d9f2f69f9f9f9f9f9f9f9f',
  })
  @ApiResponse({
    status: 200,
    description: 'Passenger found successfully',
    type: Passenger,
  })
  @ApiResponse({ status: 404, description: 'Passenger not found' })
  getPassenger(@Param('id') id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid passenger ID');
    }
    return this.passengerService.getPassenger(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all passengers',
    description: 'Fetches a list of all passengers.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all passengers',
    type: [Passenger],
  })
  async getAllPassengers() {
    return this.passengerService.getAllPassengers();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update passenger details',
    description: "Updates a passenger's details using their unique ID.",
  })
  @ApiParam({
    name: 'id',
    description: 'Unique passenger ID (24-character hex string)',
    example: '60d9f2f69f9f9f9f9f9f9f9f',
  })
  @ApiBody({ type: Passenger, description: 'The DTO to update a passenger' })
  @ApiResponse({
    status: 200,
    description: 'Passenger updated successfully',
    type: Passenger,
  })
  @ApiResponse({ status: 404, description: 'Passenger not found' })
  updatePassenger(
    @Param('id') id: string,
    @Body() updateDto: Partial<Passenger>,
  ) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid passenger ID');
    }
    return this.passengerService.updatePassenger(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete passenger by ID',
    description: 'Deletes a passenger by their unique ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique passenger ID (24-character hex string)',
    example: '60d9f2f69f9f9f9f9f9f9f9f',
  })
  @ApiResponse({ status: 200, description: 'Passenger deleted successfully' })
  @ApiResponse({ status: 404, description: 'Passenger not found' })
  deletePassenger(@Param('id') id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid passenger ID');
    }
    return this.passengerService.deletePassenger(id);
  }
}
