import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { BabyEntity, BabyRelationEntity } from './baby.entity';
import {
  AddBabyRelationDto,
  BabyAuthority,
  BabyAuthorityTypes,
  BabyDtoWithRelations,
  BabyDtoWithUserAuthority,
  BabyRoleTypes,
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

  async create(props: {
    babyEntity: BabyEntity;
    userId: string;
    authority: BabyAuthorityTypes;
    role: BabyRoleTypes;
  }): Promise<void> {
    const relationEntity = BabyRelationEntity.create({
      babyId: props.babyEntity.id,
      userId: props.userId,
      authority: props.authority,
      role: props.role,
    });

    await this.dataSource.transaction(async (manager) => {
      await manager.insert(BabyEntity, props.babyEntity);
      await manager.insert(BabyRelationEntity, relationEntity);
    });
  }

  async addRelation(props: { userId: string; babyId: string; dto: AddBabyRelationDto }): Promise<void> {
    const { babyId, userId, dto } = props;

    const userBabyRelation = await this.relationRepository.findOneBy({ userId, babyId });

    if (!userBabyRelation) {
      throw new NotFoundException('Baby not found');
    }

    if (userBabyRelation.authority !== BabyAuthority.ROLE_ADMIN) {
      throw new UnauthorizedException('No sufficient right to add a relation');
    }

    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new UnprocessableEntityException('No user match for email');
    }

    const newRelationEntity = BabyRelationEntity.create({
      babyId: props.babyId,
      userId: user.id,
      authority: dto.authority,
      role: dto.role,
    });

    await this.relationRepository.insert(newRelationEntity);
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

  async findById(babyId: string, userId: string): Promise<BabyDtoWithRelations> {
    const relations = await this.relationRepository.findBy({ babyId });

    if (!relations.find((r) => r.userId === userId)) {
      throw new NotFoundException();
    }

    const baby = await this.babyRepository.findOneBy({ id: babyId });
    const users = await this.userService.findByIds(uniq(relations.map((r) => r.userId)));

    return {
      ...baby.toDto(),
      relations: relations.map((r) => {
        const user = users.find((u) => u.id === r.userId);
        return {
          authority: r.authority,
          id: r.userId,
          firstname: user.firstname,
          lastname: user.lastname,
          role: r.role,
        };
      }),
    };
  }
}
