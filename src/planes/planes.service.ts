import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plane } from 'src/entities/planes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanesService {
  constructor(
    @InjectRepository(Plane)
    private planesRepository: Repository<Plane>,
  ) {}

  // Find all with sorting, filtering, and pagination, including total count
  async findAll(query: any): Promise<{ planes: Plane[]; total: number }> {
    const { search, sort, order = 'ASC', limit = 10, offset = 0 } = query;

    const qb = this.planesRepository.createQueryBuilder('plane');

    // Add case-insensitive search filter
    if (search) {
      qb.where(
        'LOWER(plane.name) LIKE LOWER(:search) OR LOWER(plane.code) LIKE LOWER(:search)',
        {
          search: `%${search}%`,
        },
      );
    }

    // Add sorting
    if (sort) {
      qb.orderBy(`plane.${sort}`, order.toUpperCase() as any);
    }

    // Add pagination
    qb.skip(offset).take(limit);

    // Get the result and the total count
    const [planes, total] = await qb.getManyAndCount();

    return { planes, total };
  }

  findOne(id: number): Promise<Plane> {
    return this.planesRepository.findOne({ where: { id } });
  }

  async create(plane: Plane): Promise<Plane> {
    return this.planesRepository.save(plane);
  }

  async update(id: number, plane: Plane): Promise<void> {
    await this.planesRepository.update(id, plane);
  }

  async remove(id: number): Promise<void> {
    await this.planesRepository.delete(id);
  }
}
