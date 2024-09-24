import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlinesService } from './airlines.service';
import { AirlinesController } from './airlines.controller';
import { Airline } from 'src/entities/airlines.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Airline]), AuthModule],
  providers: [AirlinesService],
  controllers: [AirlinesController],
})
export class AirlinesModule {}
