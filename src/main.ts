import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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

  // Hybrid microservice
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      },
    },
    {
      inheritAppConfig: true, // Sharring configuration (inherit global pipes, interceptors, etc)
    },
  );
  await app.startAllMicroservices(); // Inicializa e inicia  multiple oyentes (transporters) en una app hibrida

  await app.listen(envs.port);
  logger.log(`Payment Microservice running on port ${envs.port}}`);
}
bootstrap();
