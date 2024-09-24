import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportsService } from './airports.service';
import { AirportsController } from './airports.controller';
import { Airport } from 'src/entities/airports.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Airport]), AuthModule],
  providers: [AirportsService],
  controllers: [AirportsController],
})
export class AirportsModule {}
