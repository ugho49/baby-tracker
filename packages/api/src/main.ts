import { Logger } from '@nestjs/common';
import { bootstrap } from './app';
import { ConfigService } from '@nestjs/config';

async function start() {
  Logger.log('Starting server...');

  const globalPrefix = 'api/v1';
  const { nestApp } = await bootstrap(globalPrefix);
  const configService = nestApp.get(ConfigService);
  const port = configService.get('PORT');

  await nestApp.listen(port, '0.0.0.0');

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

void start();
