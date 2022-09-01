import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from '@fastify/helmet';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function createApp(prefix: string) {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  app.enableShutdownHooks();
  app.setGlobalPrefix(prefix);

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Baby Tracker')
    .setDescription('The Baby Tracker API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

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
