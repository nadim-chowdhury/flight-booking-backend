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

@Controller('passenger')
@UseGuards(JwtAuthGuard)
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Get(':id')
  getPassenger(@Param('id') id: string) {
    const passengerId = parseInt(id, 10);
    if (isNaN(passengerId)) {
      throw new BadRequestException('Invalid passenger ID');
    }
    return this.passengerService.getPassenger(passengerId);
  }

  @Patch(':id')
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
