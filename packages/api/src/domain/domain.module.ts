import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BabyModule } from './baby/baby.module';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';

@Module({
  imports: [AuthModule, UserModule, BabyModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class DomainModule {}
