import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Country } from 'src/entities/countries.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Country]), AuthModule],
  providers: [CountriesService],
  controllers: [CountriesController],
})
export class CountriesModule {}
