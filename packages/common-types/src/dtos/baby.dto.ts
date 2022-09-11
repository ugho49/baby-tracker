import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { BabyAuthority, BabyGender, BabyRole } from '../enums';

export class BabyDto {
  id: string;
  firstname: string;
  lastname: string;
  birth_date: Date;
  birth_place?: string;
  created_at: Date;
  updated_at: Date;
}

export class RoleAuthority {
  authority: BabyAuthority;
  role: BabyRole;
}

export class BabyDtoWithUserAuthority extends BabyDto {
  relation: RoleAuthority;
}

export class BabyRelation extends RoleAuthority {
  id: string;
  firstname: string;
  lastname: string;
}

export class BabyDtoWithRelations extends BabyDto {
  relations: BabyRelation[];
}

export class BabyRelationId {
  relation_id: string;
}

export class UpdateBabyDto {
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

export class RegisterBabyDto extends UpdateBabyDto {
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
