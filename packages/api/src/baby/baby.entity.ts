import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TimestampEntity, uuid } from '../database';
import { BabyAuthorityTypes, BabyDto, BabyGenderTypes, BabyRoleTypes } from '@baby-tracker/common-types';

@Entity('baby')
export class BabyEntity extends TimestampEntity {
  @PrimaryColumn()
  id: string = uuid();

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  birthDate: Date;

  @Column()
  birthPlace?: string;

  @Column()
  gender: BabyGenderTypes;

  public static create(props: {
    firstname: string;
    lastname: string;
    birthDate: Date;
    birthPlace?: string;
    gender: BabyGenderTypes;
  }): BabyEntity {
    const entity = new BabyEntity();
    entity.firstname = props.firstname;
    entity.lastname = props.lastname;
    entity.birthDate = props.birthDate;
    entity.birthPlace = props.birthPlace;
    entity.gender = props.gender;
    return entity;
  }

  toDto(): BabyDto {
    return {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      birth_date: this.birthDate,
      birth_place: this.birthPlace,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}

@Entity('baby_relation')
export class BabyRelationEntity extends TimestampEntity {
  @PrimaryColumn()
  id: string = uuid();

  @Column()
  babyId: string;

  @Column()
  userId: string;

  @Column()
  authority: BabyAuthorityTypes;

  @Column()
  role: BabyRoleTypes;

  public static create(props: {
    babyId: string;
    userId: string;
    authority: BabyAuthorityTypes;
    role: BabyRoleTypes;
  }): BabyRelationEntity {
    const entity = new BabyRelationEntity();
    entity.babyId = props.babyId;
    entity.userId = props.userId;
    entity.authority = props.authority;
    entity.role = props.role;
    return entity;
  }
}
