import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Get user profile by ID
  async getProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  // Update user profile
  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.userRepository.preload({
      id: userId,
      ...updateProfileDto,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.userRepository.save(user);
  }

  // Update profile picture path in the database
  async updateProfilePicture(
    userId: number,
    profilePicture: string,
  ): Promise<User> {
    const user = await this.userRepository.preload({
      id: userId,
      profilePicture,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.userRepository.save(user);
  }
}
