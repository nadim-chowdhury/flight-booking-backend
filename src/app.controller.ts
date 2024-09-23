import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Health check route to test server functionality
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
