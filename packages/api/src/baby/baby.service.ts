import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { BabyEntity, BabyRelationEntity, BabyTimelineEntity } from './baby.entity';
import {
  AddBabyRelationDto,
  AddOrUpdateTimelineEntryDto,
  BabyDto,
  BabyTimelineDto,
  BabyTimelineEntryDto,
  BabyWithRelationsDto,
  BabyWithUserAuthorityDto,
  GetTimelineQueryDto,
  RegisterBabyDto,
  UpdateBabyDto,
  UpdateBabyRelationDto,
} from './baby.dto';
import { UserService } from '../user/user.service';
import { uniq } from 'lodash';
import { BabyAuthority, BabyRole, BabyTimelinePagination } from '@baby-tracker/common-types';
import { DateTime } from 'luxon';
import { getNextDay, getPreviousDay } from './baby.utils';

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
      birthDate: new Date(dto.birth_date),
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

  async updateBaby(param: { babyId: string; dto: UpdateBabyDto }): Promise<BabyDto> {
    const { babyId, dto } = param;

    const entity = await this.babyRepository.findOneBy({ id: babyId });

    if (!entity) {
      throw new NotFoundException('Baby not found');
    }

    entity.firstname = dto.firstname;
    entity.lastname = dto.lastname;
    entity.gender = dto.gender;
    entity.birthDate = new Date(dto.birth_date);
    entity.birthPlace = dto.birth_place;

    await this.babyRepository.update({ id: babyId }, entity);

    return entity.toDto();
  }

  async deleteBaby(babyId: string): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.delete(BabyEntity, { id: babyId });
        await manager.delete(BabyRelationEntity, { babyId });
        await manager.delete(BabyTimelineEntity, { babyId });
      });
    } catch (e) {
      throw new InternalServerErrorException('An error occurred when deleting the baby');
    }
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

  async updateRelation(param: {
    babyId: string;
    relationId: string;
    userId: string;
    dto: UpdateBabyRelationDto;
  }): Promise<void> {
    const { dto, babyId, relationId, userId } = param;

    const entity = await this.relationRepository.findOneBy({ id: relationId, babyId });

    if (!entity) {
      throw new NotFoundException('Relation not found');
    }

    if (dto.role) {
      entity.role = dto.role;
    }

    if (dto.authority) {
      const babyRelations = await this.relationRepository.findBy({ babyId });
      const numberOfAdmins = babyRelations.filter((relation) => relation.authority === BabyAuthority.ROLE_ADMIN).length;

      // Current user is an ADMIN, no check needed
      if (entity.userId === userId && entity.authority !== dto.authority && numberOfAdmins === 1) {
        throw new UnauthorizedException('Baby should have one admin left');
      }

      entity.authority = dto.authority;
    }

    await this.relationRepository.update({ id: relationId, babyId }, entity);
  }

  async findAllByUserId(userId: string): Promise<BabyWithUserAuthorityDto[]> {
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

  async findById(babyId: string): Promise<BabyWithRelationsDto> {
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

  async getTimeline(param: { babyId: string; queryParams: GetTimelineQueryDto }): Promise<BabyTimelineDto> {
    const { babyId, queryParams } = param;

    const countOrder = queryParams.order === 'asc' ? 'DESC' : 'ASC';
    const countQuery = this.timelineRepository
      .createQueryBuilder('bt')
      .select(['DISTINCT bt.occurred_at::date'])
      .where({ babyId })
      .addOrderBy('occurred_at', countOrder);

    const days = await countQuery
      .getRawMany<{ occurred_at: string }>()
      .then((res) => res.map((r) => DateTime.fromJSDate(new Date(r.occurred_at)).toISODate()));

    if (days.length === 0) {
      return { resources: [] };
    }

    const currentDay = queryParams.day ? DateTime.fromISO(queryParams.day) : DateTime.fromISO(days[0]);
    const currentDayString = currentDay.toISODate();

    const query = this.timelineRepository
      .createQueryBuilder('bt')
      .where({ babyId })
      .andWhere('cast(bt.occurredAt as date) = cast(:day as date)')
      .setParameter('day', currentDayString);

    if (queryParams.userId) {
      query.andWhere({ achieveBy: queryParams.userId });
    }

    if (queryParams.type) {
      query.andWhere({ type: queryParams.type });
    }

    const order = queryParams.order === 'asc' ? 'ASC' : 'DESC';
    query.addOrderBy('bt.occurredAt', order);

    const list = await query.getMany();

    const entries = list.map((entity) => entity.toDto());

    const pagination: BabyTimelinePagination = {
      available_days: days.reverse(),
      current_day: currentDayString,
      previous_day: getPreviousDay(currentDayString, days),
      next_day: getNextDay(currentDayString, days),
    };

    return { resources: entries, pagination };
  }

  async createTimelineEntry(param: {
    babyId: string;
    userId: string;
    dto: AddOrUpdateTimelineEntryDto;
  }): Promise<BabyTimelineEntryDto> {
    const { babyId, dto, userId } = param;
    const entity = BabyTimelineEntity.create({
      babyId,
      type: dto.type,
      occurredAt: new Date(dto.occurredAt),
      details: dto.details,
      achieveBy: userId,
    });

    await this.timelineRepository.insert(entity);

    return entity.toDto();
  }

  async updateTimelineEntry(param: {
    babyId: string;
    timelineId: string;
    dto: AddOrUpdateTimelineEntryDto;
  }): Promise<BabyTimelineEntryDto> {
    const { babyId, dto, timelineId } = param;

    const entity = await this.timelineRepository.findOneBy({ id: timelineId, babyId });

    if (!entity) {
      throw new NotFoundException('Timeline entry not found');
    }

    entity.type = dto.type;
    entity.details = dto.details;
    entity.occurredAt = new Date(dto.occurredAt);

    await this.timelineRepository.update({ id: timelineId, babyId }, entity);

    return entity.toDto();
  }

  async deleteTimelineEntry(param: { babyId: string; timelineId: string }): Promise<void> {
    const { babyId, timelineId } = param;
    try {
      await this.timelineRepository.delete({ id: timelineId, babyId });
    } catch (e) {
      throw new NotFoundException('Timeline entry not found');
    }
  }
}
