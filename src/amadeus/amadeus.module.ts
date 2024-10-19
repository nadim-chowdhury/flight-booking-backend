import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios'; // Import from @nestjs/axios
import { AmadeusController } from './amadeus.controller'; // Use only AmadeusController
import { AmadeusService } from './amadeus.service'; // Use only AmadeusService

@Module({
  imports: [ConfigModule, HttpModule], // Include ConfigModule for environment variables
  controllers: [AmadeusController],
  providers: [AmadeusService],
})
export class AmadeusModule {}
