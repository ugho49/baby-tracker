import { Module } from '@nestjs/common';
import { BabyService } from './baby.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BabyEntity, BabyRelationEntity } from './baby.entity';
import { BabyController } from './baby.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BabyEntity, BabyRelationEntity])],
  providers: [BabyService],
  controllers: [BabyController],
  exports: [BabyService],
})
export class BabyModule {}
