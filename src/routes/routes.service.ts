import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from 'src/entities/routes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routesRepository: Repository<Route>,
  ) {}

  // Find all with sorting, filtering, and pagination
  async findAll(query: any): Promise<Route[]> {
    const { search, sort, order = 'ASC', limit = 10, offset = 0 } = query;

    const qb = this.routesRepository.createQueryBuilder('route');

    if (search) {
      qb.where(
        'route.airline_code LIKE :search OR route.source_airport LIKE :search OR route.destination_airport LIKE :search',
        { search: `%${search}%` },
      );
    }

    if (sort) {
      qb.orderBy(`route.${sort}`, order.toUpperCase() as any);
    }

    qb.skip(offset).take(limit);

    return qb.getMany();
  }

  findOne(id: number): Promise<Route> {
    return this.routesRepository.findOne({ where: { id } });
  }

  async create(route: Route): Promise<Route> {
    return this.routesRepository.save(route);
  }

  async update(id: number, route: Route): Promise<void> {
    await this.routesRepository.update(id, route);
  }

  async remove(id: number): Promise<void> {
    await this.routesRepository.delete(id);
  }
}
