import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server = express();

async function bootstrap() {
  // Use Express Adapter for compatibility with serverless environments like Vercel
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Enable Global CORS with correct configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://flight-booking-frontend-liart.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Removed wildcard '*'
    credentials: true, // Allows credentials (e.g., cookies) to be sent
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With', // Removed wildcard '*'
  });

  // Set Global Prefix
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Flight Booking System API')
    .setDescription('API documentation for the Flight Booking System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Initialize the application without listening to a specific port (for serverless)
  await app.init();
}

// Call bootstrap function to initialize the app
bootstrap();

// Export the Express server for Vercel
export default server;
