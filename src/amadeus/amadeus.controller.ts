import { Controller, Get, Query } from '@nestjs/common';
import { AmadeusService } from './amadeus.service'; // Import AmadeusService

@Controller('amadeus')
export class AmadeusController {
  constructor(private readonly amadeusService: AmadeusService) {} // Use AmadeusService

  @Get('airports')
  async searchAirports(@Query('keyword') keyword: string) {
    try {
      const data = await this.amadeusService.searchAirports(keyword);
      return data;
    } catch (error) {
      return { error: error.message };
    }
  }
}
