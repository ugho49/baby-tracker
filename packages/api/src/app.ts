import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app/app.module';

export async function bootstrap(prefix: string): Promise<{
  nestApp: NestFastifyApplication;
}> {
  Logger.log('Creating Nest application');
  const nestApp = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  nestApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  nestApp.enableCors();
  nestApp.setGlobalPrefix(prefix);

  // Logger.log('Bootstrapping swagger');
  // bootstrapSwagger(nestApp, 'Baby tracker');

  return { nestApp };
}
