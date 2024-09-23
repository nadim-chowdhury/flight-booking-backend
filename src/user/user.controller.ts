import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get profile by user ID
  @Get(':id')
  async getProfile(@Param('id') id: number) {
    return this.userService.getProfile(id);
  }

  // Update user profile
  @Patch(':id')
  async updateProfile(
    @Param('id') id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(id, updateProfileDto);
  }

  // Upload or update profile picture
  @Patch(':id/profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          cb(null, `profile-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadProfilePicture(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const profilePicturePath = `/uploads/profile-pictures/${file.filename}`;
    return this.userService.updateProfilePicture(id, profilePicturePath);
  }
}
