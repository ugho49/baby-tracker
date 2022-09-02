import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { BabyEntity, BabyRelationEntity } from './baby.entity';
import {
  AddBabyRelationDto,
  BabyAuthority,
  BabyDtoWithRelations,
  BabyDtoWithUserAuthority,
  RegisterBabyDto,
} from '@baby-tracker/common-types';
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

  async createBaby(props: { userId: string; dto: RegisterBabyDto }): Promise<BabyEntity> {
    const { userId, dto } = props;
    const authority = BabyAuthority.ROLE_ADMIN;
    const babyEntity = BabyEntity.create({
      firstname: dto.firstname,
      lastname: dto.lastname,
      gender: dto.gender,
      birthDate: dto.birth_date,
      birthPlace: dto.birth_place,
    });

    const relationEntity = BabyRelationEntity.create({
      babyId: babyEntity.id,
      userId,
      authority,
      role: dto.relation_role,
    });

    await this.dataSource.transaction(async (manager) => {
      await manager.insert(BabyEntity, babyEntity);
      await manager.insert(BabyRelationEntity, relationEntity);
    });

    return babyEntity;
  }

  async addRelation(props: { babyId: string; dto: AddBabyRelationDto }): Promise<string> {
    const { dto, babyId } = props;

    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      // TODO: send an invitation, and save the relation somewhere
      throw new UnprocessableEntityException('No user match for email');
    }

    const newRelationEntity = BabyRelationEntity.create({
      babyId,
      userId: user.id,
      authority: dto.authority,
      role: dto.role,
    });

    await this.relationRepository.insert(newRelationEntity);

    return newRelationEntity.id;
  }

  async findAllByUserId(userId: string): Promise<BabyDtoWithUserAuthority[]> {
    const relations = await this.relationRepository.findBy({ userId });
    const babies = await this.babyRepository.findBy({ id: In(relations.map((r) => r.babyId)) });

    return babies.map((entity) => {
      const relation = relations.find((r) => r.babyId === entity.id);

      return {
        ...entity.toDto(),
        relation: { authority: relation.authority, role: relation.role },
      };
    });
  }

  async findById(babyId: string): Promise<BabyDtoWithRelations> {
    const relations = await this.relationRepository.findBy({ babyId });
    const baby = await this.babyRepository.findOneBy({ id: babyId });
    const users = await this.userService.findByIds(uniq(relations.map((r) => r.userId)));

    return {
      ...baby.toDto(),
      relations: relations.map((r) => {
        const user = users.find((u) => u.id === r.userId);
        return {
          id: r.id,
          authority: r.authority,
          firstname: user.firstname,
          lastname: user.lastname,
          role: r.role,
        };
      }),
    };
  }

  async getBabyRelation(babyId: string, userId: string): Promise<BabyRelationEntity | undefined> {
    return (await this.relationRepository.findOneBy({ babyId, userId })) || undefined;
  }
}
