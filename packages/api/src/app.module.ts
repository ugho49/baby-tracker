import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { DomainModule } from './domain/domain.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [CoreModule, DomainModule],
})
export class AppModule {}
