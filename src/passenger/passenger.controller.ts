import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Passenger } from 'src/entities/passenger.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Passenger')
@Controller('passenger')
@UseGuards(JwtAuthGuard)
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get passenger by ID' })
  @ApiResponse({ status: 200, description: 'Passenger found successfully' })
  @ApiResponse({ status: 404, description: 'Passenger not found' })
  getPassenger(@Param('id') id: string) {
    const passengerId = parseInt(id, 10);
    if (isNaN(passengerId)) {
      throw new BadRequestException('Invalid passenger ID');
    }
    return this.passengerService.getPassenger(passengerId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update passenger details' })
  @ApiBody({ type: Passenger })
  @ApiResponse({ status: 200, description: 'Passenger updated successfully' })
  @ApiResponse({ status: 404, description: 'Passenger not found' })
  updatePassenger(
    @Param('id') id: string,
    @Body() updateDto: Partial<Passenger>,
  ) {
    const passengerId = parseInt(id, 10);
    if (isNaN(passengerId)) {
      throw new BadRequestException('Invalid passenger ID');
    }
    return this.passengerService.updatePassenger(passengerId, updateDto);
  }

  @Patch(':id/profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload passenger profile picture' })
  @ApiResponse({
    status: 200,
    description: 'Profile picture uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid file or passenger ID' })
  @ApiBody({ description: 'Profile picture file', type: 'multipart/form-data' })
  uploadProfilePicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const passengerId = parseInt(id, 10);
    if (isNaN(passengerId)) {
      throw new BadRequestException('Invalid passenger ID');
    }

    if (!file) {
      throw new BadRequestException('File must be uploaded');
    }

    const profilePicture = `/uploads/profile-pictures/${file.filename}`;
    return this.passengerService.updateProfilePicture(
      passengerId,
      profilePicture,
    );
  }
}
