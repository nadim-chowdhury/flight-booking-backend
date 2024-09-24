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
import { PlanesService } from './planes.service';
import { Plane } from 'src/entities/planes.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Planes')
@Controller('planes')
@UseGuards(JwtAuthGuard, RolesGuard) // Apply JWT auth and roles guard
@ApiBearerAuth()
export class PlanesController {
  constructor(private readonly planesService: PlanesService) {}

  // Public: Get all planes with optional filters
  @Get()
  @ApiOperation({ summary: 'Get all planes with optional filters' })
  @ApiResponse({ status: 200, description: 'Return list of planes.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(@Query() query: any): Promise<Plane[]> {
    return this.planesService.findAll(query);
  }

  // Public: Get plane by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a plane by ID' })
  @ApiResponse({ status: 200, description: 'Return plane details.' })
  @ApiResponse({ status: 404, description: 'Plane not found.' })
  findOne(@Param('id') id: number): Promise<Plane> {
    return this.planesService.findOne(id);
  }

  // Admin only: Create a new plane
  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new plane (Admin only)' })
  @ApiResponse({ status: 201, description: 'The plane has been created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() plane: Plane): Promise<Plane> {
    return this.planesService.create(plane);
  }

  // Admin only: Update a plane
  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a plane (Admin only)' })
  @ApiResponse({ status: 200, description: 'The plane has been updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: number, @Body() plane: Plane): Promise<void> {
    return this.planesService.update(id, plane);
  }

  // Admin only: Delete a plane
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a plane (Admin only)' })
  @ApiResponse({ status: 200, description: 'The plane has been deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.planesService.remove(id);
  }
}
