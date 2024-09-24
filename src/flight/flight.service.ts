import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from 'src/entities/flight.entity';
import { SearchFlightDto } from './dto/search-flight.dto';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
  ) {}

  // Get all flights
  async getFlights(): Promise<Flight[]> {
    return this.flightRepository.find();
  }

  // Search flights based on parameters
  async searchFlights(searchFlightDto: SearchFlightDto): Promise<Flight[]> {
    const { from, to, departureDate, returnDate } = searchFlightDto;
    const query = this.flightRepository
      .createQueryBuilder('flight')
      .where('flight.from = :from', { from })
      .andWhere('flight.to = :to', { to })
      .andWhere('DATE(flight.departureTime) = :departureDate', {
        departureDate,
      });

    if (returnDate) {
      query.andWhere('DATE(flight.arrivalTime) = :returnDate', { returnDate });
    }

    return query.getMany();
  }

  // Get flight by ID
  async getFlightById(id: number): Promise<Flight> {
    const flight = await this.flightRepository.findOne({ where: { id } });
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
    return flight;
  }

  // Create a new flight using CreateFlightDto
  async createFlight(createFlightDto: CreateFlightDto): Promise<Flight> {
    // Use the DTO to create a new Flight entity
    const flight = this.flightRepository.create(createFlightDto);

    // Save the new Flight entity in the database
    return this.flightRepository.save(flight);
  }

  // Update flight details
  async updateFlight(
    id: number,
    updateFlightDto: UpdateFlightDto,
  ): Promise<Flight> {
    const flight = await this.flightRepository.preload({
      id,
      ...updateFlightDto,
    });

    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }

    return this.flightRepository.save(flight);
  }

  // Delete a flight
  async deleteFlight(id: number): Promise<void> {
    const result = await this.flightRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
  }
}
