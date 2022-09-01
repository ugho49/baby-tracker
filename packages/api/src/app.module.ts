import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { DbModule } from './database/db.module';
import { UserModule } from './users/user.module';
import { AuthModule, JwtAuthGuard } from './auth';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    HealthModule,
    DbModule,
    UserModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      expandVariables: true,
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
