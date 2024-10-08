import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// Correct import for Express
// import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const express = require('express');
const server = express(); // Initialize Express

async function bootstrap() {
  // Create Nest application with Express adapter
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'https://flight-booking-frontend-liart.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });

  // Set global prefix for the API
  app.setGlobalPrefix('api');

  // Swagger configuration for API documentation
  const config = new DocumentBuilder()
    .setTitle('Flight Booking System API')
    .setDescription('API documentation for the Flight Booking System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Listen on port 8000 (for local development)
  await app.listen(8000);
}

// Bootstrap the application
bootstrap();

// Export the Express server for serverless environments (e.g., Vercel)
export default server;
