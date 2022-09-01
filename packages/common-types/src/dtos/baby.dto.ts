import { IsDateString, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { BabyGender } from '../enums';
import { BabyAuthorityTypes } from '../types';

export interface BabyDto {
  id: string;
  firstname: string;
  lastname: string;
  birth_date: Date;
  birth_place?: string;
  created_at: Date;
  updated_at: Date;
}

export interface BabyDtoWithUserAuthority extends BabyDto {
  user_authority: BabyAuthorityTypes;
}

export interface BabyDtoWithRelations extends BabyDto {
  relations: { id: string; firstname: string; lastname: string; authority: BabyAuthorityTypes }[];
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
}
