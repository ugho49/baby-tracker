import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { BabyEntity, BabyRelationEntity, BabyTimelineEntity } from './baby.entity';
import {
  AddBabyRelationDto,
  AddTimelineEntryDto,
  BabyAuthority,
  BabyDto,
  BabyDtoWithRelations,
  BabyDtoWithUserAuthority,
  BabyRole,
  BabyTimelineDto,
  GetTimelineQueryDto,
  RegisterBabyDto,
} from '@baby-tracker/common-types';
import { UserService } from '../user/user.service';
import { uniq } from 'lodash';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class BabyService {
  constructor(
    @InjectRepository(BabyEntity)
    private readonly babyRepository: Repository<BabyEntity>,
    @InjectRepository(BabyRelationEntity)
    private readonly relationRepository: Repository<BabyRelationEntity>,
    @InjectRepository(BabyTimelineEntity)
    private readonly timelineRepository: Repository<BabyTimelineEntity>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource
  ) {}

  async createBaby(param: { userId: string; dto: RegisterBabyDto }): Promise<BabyDto> {
    const { userId, dto } = param;
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

    return babyEntity.toDto();
  }

  async deleteBaby(babyId: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(BabyEntity, { id: babyId });
      await manager.delete(BabyRelationEntity, { babyId });
      await manager.delete(BabyTimelineEntity, { babyId });
    });
  }

  async addRelation(param: { babyId: string; dto: AddBabyRelationDto }): Promise<string> {
    const { dto, babyId } = param;

    const user = await this.userService.findEntityByEmail(dto.email);

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
        relation: { authority: BabyAuthority[relation.authority], role: BabyRole[relation.role] },
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
          firstname: user.firstname,
          lastname: user.lastname,
          authority: BabyAuthority[r.authority],
          role: BabyRole[r.role],
        };
      }),
    };
  }

  async getBabyRelation(babyId: string, userId: string): Promise<BabyRelationEntity | undefined> {
    return (await this.relationRepository.findOneBy({ babyId, userId })) || undefined;
  }

  async deleteRelation(param: { babyId: string; relationId: string; userId: string }) {
    const { babyId, relationId, userId } = param;
    const babyRelations = await this.relationRepository.findBy({ babyId });
    const relationToDelete = babyRelations.find((r) => r.id === relationId);

    if (!relationToDelete) {
      throw new NotFoundException();
    }

    if (babyRelations.length === 1) {
      throw new UnauthorizedException('Baby should have one relation left');
    }

    const numberOfAdmins = babyRelations.filter((relation) => relation.authority === BabyAuthority.ROLE_ADMIN).length;

    if (relationToDelete.userId === userId && numberOfAdmins === 1) {
      throw new UnauthorizedException('Baby should have one admin left');
    }

    await this.relationRepository.delete({ id: relationId });
  }

  async getTimeline(param: { babyId: string; queryParams: GetTimelineQueryDto }): Promise<BabyTimelineDto[]> {
    const { babyId, queryParams } = param;

    let where: FindOptionsWhere<BabyTimelineEntity> = { babyId };

    if (queryParams.userId) {
      where = { ...where, achieveBy: queryParams.userId };
    }

    if (queryParams.type) {
      where = { ...where, type: queryParams.type };
    }

    // TODO: handle day query param

    return this.timelineRepository.findBy(where).then((entities) => entities.map((entity) => entity.toDto()));
  }

  async createTimelineEntry(param: {
    babyId: string;
    userId: string;
    dto: AddTimelineEntryDto;
  }): Promise<BabyTimelineDto> {
    const { babyId, dto, userId } = param;
    const entity = BabyTimelineEntity.create({
      babyId,
      type: dto.type,
      occurredAt: dto.occurredAt,
      details: dto.details,
      achieveBy: userId,
    });

    await this.timelineRepository.insert(entity);

    return entity.toDto();
  }

  async deleteTimelineEntry(param: { babyId: string; timelineId: string }): Promise<void> {
    const { babyId, timelineId } = param;
    await this.timelineRepository.delete({ id: timelineId, babyId });
  }
}
