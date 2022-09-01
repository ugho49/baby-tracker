import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BabyEntity, BabyRelationEntity } from './baby.entity';
import { BabyAuthorityTypes } from '@baby-tracker/common-types';

@Injectable()
export class BabyService {
  constructor(
    @InjectRepository(BabyEntity)
    private readonly babyRepository: Repository<BabyEntity>,
    @InjectRepository(BabyRelationEntity)
    private readonly relationRepository: Repository<BabyRelationEntity>,
    private dataSource: DataSource
  ) {}

  async create(props: { babyEntity: BabyEntity; userId: string; authority: BabyAuthorityTypes }) {
    await this.dataSource.transaction(async (manager) => {
      await manager.insert(BabyEntity, props.babyEntity);
      await manager.insert(
        BabyRelationEntity,
        BabyRelationEntity.create({ babyId: props.babyEntity.id, userId: props.userId, authority: props.authority })
      );
    });
  }
}
