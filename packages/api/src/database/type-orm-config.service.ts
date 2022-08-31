import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import dbConfig from './db.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(dbConfig.KEY)
    private readonly config: ConfigType<typeof dbConfig>
  ) {}

  createTypeOrmOptions = () => this.config;
}
