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

  // Find all with sorting, filtering, and pagination, including total count
  async findAll(query: any): Promise<{ airlines: Airline[]; total: number }> {
    const {
      search,
      sort = 'name', // Default sort field
      order = 'ASC', // Default sort order
      limit = 10,
      offset = 0,
    } = query;

    const qb = this.airlinesRepository.createQueryBuilder('airline');

    // Add case-insensitive search filter
    if (search) {
      qb.where(
        'LOWER(airline.name) LIKE LOWER(:search) OR LOWER(airline.country) LIKE LOWER(:search)',
        {
          search: `%${search}%`,
        },
      );
    }

    // Add sorting by the provided column or default to 'name'
    if (sort) {
      const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // Ensure proper sorting order
      qb.orderBy(`airline.${sort}`, sortOrder as any);
    }

    // Add pagination
    qb.skip(offset).take(limit);

    // Get the result and total count
    const [airlines, total] = await qb.getManyAndCount();

    return { airlines, total };
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
