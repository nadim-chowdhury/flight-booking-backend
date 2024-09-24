import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Flight Booking System API')
    .setDescription('API documentation for the Flight Booking System')
    .setVersion('1.0')
    .addBearerAuth() // To enable JWT authentication in Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Access the docs at /api/docs

  await app.listen(8000);
}
bootstrap();
