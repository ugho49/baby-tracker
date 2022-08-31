import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from './db.config';
import { TypeOrmConfigService } from './type-orm-config.service';

@Module({
  imports: [
    ConfigModule.forFeature(dbConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(dbConfig)],
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [Logger],
})
export class DbModule {}
