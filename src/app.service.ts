import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // A simple method returning a string to be used in the health check
  getHello(): string {
    return 'Hello World! Flight Booking System is Running';
  }
}
