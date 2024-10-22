import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Passenger } from '../schemas/passenger.schema';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';
@Injectable()
export class PassengerService {
  constructor(
    @InjectModel(Passenger.name)
    private readonly passengerModel: Model<Passenger>,
  ) {}

  async createPassenger(
    createPassengerDto: CreatePassengerDto,
  ): Promise<Partial<Passenger>> {
    const { passportNumber } = createPassengerDto;

    // Check if the passport number already exists
    const existingPassenger = await this.passengerModel
      .findOne({ passportNumber })
      .exec();
    if (existingPassenger) {
      throw new ConflictException(
        'Passenger with this passport number already exists',
      );
    }

    // Create a new passenger with a unique passenger ID
    const passenger = new this.passengerModel({
      ...createPassengerDto,
      passengerId: uuidv4(),
    });

    const savedPassenger = await passenger.save();

    // Return only the relevant fields for the frontend, including _id
    const { _id, firstName, lastName, passengerId, dateOfBirth, title } =
      savedPassenger;

    return {
      _id: _id as Types.ObjectId, // Explicitly return the _id as an ObjectId
      passengerId,
      firstName,
      lastName,
      dateOfBirth,
      title,
    };
  }

  async createMultiplePassengers(
    passengers: CreatePassengerDto[],
  ): Promise<Partial<Passenger>[]> {
    console.log('passengers:', passengers);
    const createdPassengers = [];

    for (const createPassengerDto of passengers) {
      try {
        // Create each passenger using the existing createPassenger method
        const passenger = await this.createPassenger(createPassengerDto);
        createdPassengers.push(passenger);
      } catch (error) {
        if (error instanceof ConflictException) {
          console.warn(
            `Passenger with passport number ${createPassengerDto.passportNumber} already exists.`,
          );
          // You can choose to skip this passenger or handle it differently if needed
        } else {
          throw error; // Re-throw other errors
        }
      }
    }

    return createdPassengers;
  }

  async getPassenger(id: string): Promise<Passenger> {
    const passenger = await this.passengerModel.findById(id).exec();
    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
    return passenger;
  }

  async getAllPassengers(): Promise<Passenger[]> {
    return this.passengerModel.find().exec();
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

  async deletePassenger(id: string): Promise<void> {
    const deletedPassenger = await this.passengerModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedPassenger) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
  }
}
