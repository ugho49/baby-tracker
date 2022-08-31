import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      expandVariables: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
