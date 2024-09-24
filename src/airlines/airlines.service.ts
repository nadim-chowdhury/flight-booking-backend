import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Airline } from 'src/entities/airlines.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AirlinesService {
  constructor(
    @InjectRepository(Airline)
    private airlinesRepository: Repository<Airline>,
  ) {}

  // Find all with sorting, filtering, and pagination
  async findAll(query: any): Promise<Airline[]> {
    const { search, sort, order = 'ASC', limit = 10, offset = 0 } = query;

    const qb = this.airlinesRepository.createQueryBuilder('airline');

    if (search) {
      qb.where('airline.name LIKE :search OR airline.country LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sort) {
      qb.orderBy(`airline.${sort}`, order.toUpperCase() as any);
    }

    qb.skip(offset).take(limit);

    return qb.getMany();
  }

  findOne(id: number): Promise<Airline> {
    return this.airlinesRepository.findOne({ where: { id } });
  }

  async create(airline: Airline): Promise<Airline> {
    return this.airlinesRepository.save(airline);
  }

  async update(id: number, airline: Airline): Promise<void> {
    await this.airlinesRepository.update(id, airline);
  }

  async remove(id: number): Promise<void> {
    await this.airlinesRepository.delete(id);
  }
}
