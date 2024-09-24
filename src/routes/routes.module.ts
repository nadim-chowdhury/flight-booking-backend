import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { Route } from 'src/entities/routes.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Route]), AuthModule],
  providers: [RoutesService],
  controllers: [RoutesController],
})
export class RoutesModule {}
