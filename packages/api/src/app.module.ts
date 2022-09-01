import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { DbModule } from './database/db.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { BabyModule } from './baby/baby.module';

@Module({
  imports: [
    AuthModule,
    HealthModule,
    DbModule,
    UserModule,
    BabyModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      expandVariables: true,
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
