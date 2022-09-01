import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { BabyEntity, BabyRelationEntity } from './baby.entity';
import { BabyAuthorityTypes, BabyDtoWithRelations, BabyDtoWithUserAuthority } from '@baby-tracker/common-types';
import { UserService } from '../user/user.service';
import { uniq } from 'lodash';

@Injectable()
export class BabyService {
  constructor(
    @InjectRepository(BabyEntity)
    private readonly babyRepository: Repository<BabyEntity>,
    @InjectRepository(BabyRelationEntity)
    private readonly relationRepository: Repository<BabyRelationEntity>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource
  ) {}

  async create(props: { babyEntity: BabyEntity; userId: string; authority: BabyAuthorityTypes }): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.insert(BabyEntity, props.babyEntity);
      await manager.insert(
        BabyRelationEntity,
        BabyRelationEntity.create({ babyId: props.babyEntity.id, userId: props.userId, authority: props.authority })
      );
    });
  }

  async findAllByUserId(userId: string): Promise<BabyDtoWithUserAuthority[]> {
    const relations = await this.relationRepository.findBy({ userId });
    const babies = await this.babyRepository.findBy({ id: In(relations.map((r) => r.babyId)) });

    return babies.map((entity) => ({
      ...entity.toDto(),
      user_authority: relations.find((r) => r.babyId === entity.id).authority,
    }));
  }

  async findById(babyId: string, userId: string): Promise<BabyDtoWithRelations> {
    const relations = await this.relationRepository.findBy({ babyId, userId });

    if (relations.length === 0) {
      throw new NotFoundException();
    }

    const baby = await this.babyRepository.findOneBy({ id: babyId });
    const users = await this.userService.findByIds(uniq(relations.map((r) => r.userId)));

    return {
      ...baby.toDto(),
      relations: relations.map((r) => {
        const user = users.find((u) => u.id === r.userId);
        return { authority: r.authority, id: r.userId, firstname: user.firstname, lastname: user.lastname };
      }),
    };
  }
}
