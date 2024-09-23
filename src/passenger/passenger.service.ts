import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Passenger } from 'src/entities/passenger.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PassengerService {
  constructor(
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
  ) {}

  async getPassenger(id: number): Promise<Passenger> {
    const passenger = await this.passengerRepository.findOne({ where: { id } });
    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
    return passenger;
  }

  async updatePassenger(
    id: number,
    updateDto: Partial<Passenger>,
  ): Promise<Passenger> {
    await this.passengerRepository.update(id, updateDto);
    return this.getPassenger(id);
  }

  async updateProfilePicture(
    id: number,
    profilePicture: string,
  ): Promise<Passenger> {
    await this.passengerRepository.update(id, { profilePicture });
    return this.getPassenger(id);
  }
}
