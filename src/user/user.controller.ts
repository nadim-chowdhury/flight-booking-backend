import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  // UploadedFile, // Commented out since we're not handling file uploads anymore
  // UseInterceptors, // Commented out since we're not using file upload interceptors
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { FileInterceptor } from '@nestjs/platform-express'; // No longer needed
// import { diskStorage } from 'multer'; // No longer needed
// import { extname } from 'path'; // No longer needed
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Param('id') id: number) {
    return this.userService.getProfile(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @Param('id') id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(id, updateProfileDto);
  }

  /*
  @Patch(':id/profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-pictures', // Commented out to prevent writing to local disk
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          cb(null, `profile-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload or update user profile picture' })
  @ApiResponse({
    status: 200,
    description: 'Profile picture updated successfully',
  })
  @ApiBody({ description: 'Profile picture file', type: 'multipart/form-data' })
  async uploadProfilePicture(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const profilePicturePath = `/uploads/profile-pictures/${file.filename}`;
    return this.userService.updateProfilePicture(id, profilePicturePath);
  }
  */
}
