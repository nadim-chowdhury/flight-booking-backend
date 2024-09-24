import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AirportsService } from './airports.service';
import { Airport } from 'src/entities/airports.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Airports') // Group the routes under 'Airports' in Swagger UI
@ApiBearerAuth() // Adds JWT bearer token authentication support in Swagger UI
@UseGuards(JwtAuthGuard, RolesGuard) // Apply JWT auth and roles guard
@Controller('airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  // Public: Get all airports with optional filters
  @Get()
  @ApiOperation({ summary: 'Get all airports with optional filters' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search airports by name, city, or country',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Sort by any field, e.g., name, city, or country',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: 'Order by ASC or DESC',
    example: 'ASC',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit number of results',
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset results for pagination',
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'List of airports returned successfully',
    type: [Airport],
  })
  findAll(@Query() query: any): Promise<Airport[]> {
    return this.airportsService.findAll(query);
  }

  // Public: Get airport by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get airport by ID' })
  @ApiParam({ name: 'id', description: 'ID of the airport', example: 1 })
  @ApiResponse({ status: 200, description: 'Airport found', type: Airport })
  @ApiResponse({ status: 404, description: 'Airport not found' })
  findOne(@Param('id') id: number): Promise<Airport> {
    return this.airportsService.findOne(id);
  }

  // Admin only: Create a new airport
  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new airport (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Airport created successfully',
    type: Airport,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() airport: Airport): Promise<Airport> {
    return this.airportsService.create(airport);
  }

  // Admin only: Update an airport
  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update an airport by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'ID of the airport to update',
    example: 1,
  })
  @ApiResponse({ status: 204, description: 'Airport updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(@Param('id') id: number, @Body() airport: Airport): Promise<void> {
    return this.airportsService.update(id, airport);
  }

  // Admin only: Delete an airport
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete an airport by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'ID of the airport to delete',
    example: 1,
  })
  @ApiResponse({ status: 204, description: 'Airport deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: number): Promise<void> {
    return this.airportsService.remove(id);
  }
}
