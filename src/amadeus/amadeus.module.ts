import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios'; // Import for HttpService
import { AmadeusController } from './amadeus.controller'; // Controller for Amadeus API
import { AmadeusService } from './amadeus.service'; // Service for Amadeus API

@Module({
  imports: [ConfigModule, HttpModule], // Include ConfigModule for environment variables
  controllers: [AmadeusController], // Include AmadeusController if needed
  providers: [AmadeusService], // Provide AmadeusService for dependency injection
  exports: [AmadeusService], // Export AmadeusService for use in other modules
})
export class AmadeusModule {}
