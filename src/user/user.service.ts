import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    await this.userRepository.update(userId, updateProfileDto);
    return this.getProfile(userId);
  }

  async updateProfilePicture(
    userId: number,
    profilePicture: string,
  ): Promise<User> {
    await this.userRepository.update(userId, { profilePicture });
    return this.getProfile(userId);
  }
}

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './user.entity';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//   ) {}

//   async getUsers(): Promise<User[]> {
//     return this.userRepository.find();
//   }

//   async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
//     const user = await this.userRepository.preload({
//       id,
//       ...updateUserDto,
//     });

//     if (!user) {
//       throw new NotFoundException(`User with ID ${id} not found`);
//     }

//     return this.userRepository.save(user);
//   }

//   async deleteUser(id: number): Promise<void> {
//     const result = await this.userRepository.delete(id);
//     if (result.affected === 0) {
//       throw new NotFoundException(`User with ID ${id} not found`);
//     }
//   }
// }
