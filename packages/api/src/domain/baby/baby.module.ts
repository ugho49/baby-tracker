import { Module } from '@nestjs/common';
import { BabyService } from './baby.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BabyEntity, BabyRelationEntity, BabyTimelineEntity } from './baby.entity';
import { BabyController } from './baby.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([BabyEntity, BabyRelationEntity, BabyTimelineEntity])],
  providers: [BabyService],
  controllers: [BabyController],
  exports: [BabyService],
})
export class BabyModule {}
