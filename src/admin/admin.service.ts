import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity';
import { Flight } from '../entities/flight.entity';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getOverview() {
    const totalBookings = await this.bookingRepository.count();
    const totalUsers = await this.userRepository.count();
    const totalFlights = await this.flightRepository.count();
    const totalRevenue = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'sum')
      .getRawOne();

    return {
      totalBookings,
      totalUsers,
      totalFlights,
      totalRevenue: totalRevenue?.sum || 0,
    };
  }
}
