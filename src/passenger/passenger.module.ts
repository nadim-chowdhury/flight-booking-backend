import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';
import { Passenger } from 'src/entities/passenger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger])],
  controllers: [PassengerController],
  providers: [PassengerService],
  exports: [PassengerService],
})
export class PassengerModule {}
