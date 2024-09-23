import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchFlightDto } from './dto/search-flight.dto';
import { Flight } from 'src/entities/flight.entity';

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
  ) {}

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

  async getFlightById(id: any): Promise<Flight> {
    const flight = await this.flightRepository.findOne(id);
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
    return flight;
  }

  async createFlight(flight: Flight): Promise<Flight> {
    return this.flightRepository.save(flight);
  }

  async updateFlight(id: number, flight: Partial<Flight>): Promise<Flight> {
    await this.flightRepository.update(id, flight);
    return this.getFlightById(id);
  }

  async deleteFlight(id: number): Promise<void> {
    const result = await this.flightRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
  }
}
