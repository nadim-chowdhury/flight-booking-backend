import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App') // Groups routes in Swagger under 'App' tag
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check' }) // Describe what the endpoint does
  getHello(): string {
    return this.appService.getHello();
  }
}
