// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Passenger } from 'src/entities/passenger.entity';
// import { Repository } from 'typeorm';

// @Injectable()
// export class PassengerService {
//   constructor(
//     @InjectRepository(Passenger)
//     private readonly passengerRepository: Repository<Passenger>,
//   ) {}

//   async getPassenger(id: number): Promise<Passenger> {
//     const passenger = await this.passengerRepository.findOne({ where: { id } });
//     if (!passenger) {
//       throw new NotFoundException(`Passenger with ID ${id} not found`);
//     }
//     return passenger;
//   }

//   async updatePassenger(
//     id: number,
//     updateDto: Partial<Passenger>,
//   ): Promise<Passenger> {
//     await this.passengerRepository.update(id, updateDto);
//     return this.getPassenger(id);
//   }

//   async updateProfilePicture(
//     id: number,
//     profilePicture: string,
//   ): Promise<Passenger> {
//     await this.passengerRepository.update(id, { profilePicture });
//     return this.getPassenger(id);
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Passenger } from '../schemas/passenger.schema';

@Injectable()
export class PassengerService {
  constructor(
    @InjectModel(Passenger.name)
    private readonly passengerModel: Model<Passenger>,
  ) {}

  async getPassenger(id: string): Promise<Passenger> {
    const passenger = await this.passengerModel.findById(id).exec();
    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
    return passenger;
  }

  async updatePassenger(
    id: string,
    updateDto: Partial<Passenger>,
  ): Promise<Passenger> {
    const updatedPassenger = await this.passengerModel
      .findByIdAndUpdate(id, updateDto, {
        new: true,
      })
      .exec();
    if (!updatedPassenger) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
    return updatedPassenger;
  }

  async updateProfilePicture(
    id: string,
    profilePicture: string,
  ): Promise<Passenger> {
    const updatedPassenger = await this.passengerModel
      .findByIdAndUpdate(id, { profilePicture }, { new: true })
      .exec();
    if (!updatedPassenger) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
    return updatedPassenger;
  }
}
