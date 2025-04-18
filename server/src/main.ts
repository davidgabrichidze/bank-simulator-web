import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for development
  app.enableCors();
  
  // Global prefix for all routes
  app.setGlobalPrefix('api');
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Bank Operations Simulator API')
    .setDescription('API for bank operations simulation')
    .setVersion('1.0')
    .addTag('accounts')
    .addTag('transactions')
    .addTag('loans')
    .addTag('events')
    .addTag('optio')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start the application
  const port = 3000;
  await app.listen(port);
  console.log(`Application running on port ${port}`);
}

bootstrap();
