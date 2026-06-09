import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Bootstrap - Payment Microservice');
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Enable the raw body to be stored on the request
  });
  // Vaidation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(envs.port);
  logger.log(`Payment Microservice running on port ${envs.port}}`);
}
bootstrap();
