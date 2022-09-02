import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { BabyAuthority, BabyGender, BabyRole } from '../enums';
import { BabyAuthorityTypes, BabyRoleTypes } from '../types';

export class BabyDto {
  id: string;
  firstname: string;
  lastname: string;
  birth_date: Date;
  birth_place?: string;
  created_at: Date;
  updated_at: Date;
}

export interface BabyDtoWithUserAuthority extends BabyDto {
  relation: {
    authority: BabyAuthorityTypes;
    role: BabyRoleTypes;
  };
}

export interface BabyDtoWithRelations extends BabyDto {
  relations: { id: string; firstname: string; lastname: string; authority: BabyAuthorityTypes; role: BabyRoleTypes }[];
}

export class BabyRelationId {
  relation_id: string;
}

export class RegisterBabyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastname: string;

  @IsNotEmpty()
  @IsDateString()
  birth_date: Date;

  @IsString()
  @MaxLength(100)
  birth_place?: string;

  @IsNotEmpty()
  @IsEnum(BabyGender)
  gender: BabyGender;

  @IsNotEmpty()
  @IsEnum(BabyRole)
  relation_role: BabyRole;
}

export class AddBabyRelationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(BabyAuthority)
  authority: BabyAuthority;

  @IsNotEmpty()
  @IsEnum(BabyRole)
  role: BabyRole;
}
