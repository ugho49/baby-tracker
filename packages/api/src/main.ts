import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function createApp(prefix: string) {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  app.enableShutdownHooks();
  app.setGlobalPrefix(prefix);

  return app;
}

async function start() {
  Logger.log('Starting server...');

  const globalPrefix = 'api/v1';

  const app = await createApp(globalPrefix);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

void start();
