import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { User } from '../entities/user.entity';
import { Flight } from '../entities/flight.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
  ) {}

  async addReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { userId, flightId, content } = createReviewDto;

    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const flight = await this.flightRepository.findOne(flightId);
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${flightId} not found`);
    }

    const review = this.reviewRepository.create({
      content,
      user,
      flight,
      createdAt: new Date(),
    });

    return this.reviewRepository.save(review);
  }

  async getReviewsByFlight(flightId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { flight: { id: flightId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}
