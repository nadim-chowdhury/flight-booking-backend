import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanesService } from './planes.service';
import { PlanesController } from './planes.controller';
import { Plane } from 'src/entities/planes.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Plane]), AuthModule],
  providers: [PlanesService],
  controllers: [PlanesController],
})
export class PlanesModule {}
