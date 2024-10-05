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

  // Find all with sorting, filtering, and pagination, including total count
  async findAll(query: any): Promise<{ routes: Route[]; total: number }> {
    // Default sorting by 'id' if no sort field is provided
    const {
      search,
      sort = 'id',
      order = 'ASC',
      limit = 10,
      offset = 0,
    } = query;

    const qb = this.routesRepository.createQueryBuilder('route');

    // Add case-insensitive search filter if provided
    if (search) {
      qb.where(
        'LOWER(route.airline_code) LIKE LOWER(:search) OR LOWER(route.departure_airport) LIKE LOWER(:search) OR LOWER(route.arrival_airport) LIKE LOWER(:search) OR LOWER(route.flight_number) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    // Add sorting by the provided column or default to 'id'
    qb.orderBy(`route.${sort}`, order.toUpperCase() as any);

    // Add pagination (limit and offset)
    qb.skip(offset).take(limit);

    // Get the results and the total count
    const [routes, total] = await qb.getManyAndCount();

    return { routes, total };
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
