import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/entities/countries.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private countriesRepository: Repository<Country>,
  ) {}

  // Find all with sorting, filtering, and pagination, including total count
  async findAll(query: any): Promise<{ countries: Country[]; total: number }> {
    const { search, sort, order = 'ASC', limit = 10, offset = 0 } = query;

    const qb = this.countriesRepository.createQueryBuilder('country');

    if (search) {
      qb.where('country.name LIKE :search OR country.code LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sort) {
      qb.orderBy(`country.${sort}`, order.toUpperCase() as any);
    }

    qb.skip(offset).take(limit);

    // Get results and total count
    const [countries, total] = await qb.getManyAndCount();

    return { countries, total };
  }

  findOne(code: string): Promise<Country> {
    return this.countriesRepository.findOne({ where: { code } });
  }

  async create(country: Country): Promise<Country> {
    return this.countriesRepository.save(country);
  }

  async update(code: string, country: Country): Promise<void> {
    await this.countriesRepository.update(code, country);
  }

  async remove(code: string): Promise<void> {
    await this.countriesRepository.delete(code);
  }
}
