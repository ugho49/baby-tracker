import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  validate,
  ValidateBy,
  ValidationArguments,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  Activity,
  AddBabyRelation,
  AddOrUpdateTimelineEntry,
  Baby,
  BabyAuthority,
  BabyBottle,
  BabyBottleUnit,
  BabyBottleUnitType,
  BabyGender,
  BabyRelation,
  BabyRelationId,
  BabyRole,
  BabyTimeline,
  BabyTimelineEntry,
  BabyTimelinePagination,
  BabyTimelineType,
  BabyTimelineTypeDetail,
  BabyWithRelations,
  BabyWithUserAuthority,
  Breastfeeding,
  Diaper,
  GetTimelineQuery,
  Meal,
  Medicine,
  Nap,
  Note,
  RegisterBaby,
  RoleAuthority,
  UpdateBaby,
  UpdateBabyRelation,
} from '@baby-tracker/common-types';

export class BabyDto implements Baby {
  id: string;
  firstname: string;
  lastname: string;
  birth_date: string;
  birth_place?: string;
  created_at: string;
  updated_at: string;
  gender: BabyGender;
}

export class RoleAuthorityDto implements RoleAuthority {
  authority: BabyAuthority;
  role: BabyRole;
}

export class BabyWithUserAuthorityDto extends BabyDto implements BabyWithUserAuthority {
  relation: RoleAuthority;
}

export class BabyRelationDto extends RoleAuthorityDto implements BabyRelation {
  id: string;
  firstname: string;
  lastname: string;
}

export class BabyWithRelationsDto extends BabyDto implements BabyWithRelations {
  relations: BabyRelation[];
}

export class BabyRelationIdDto implements BabyRelationId {
  relation_id: string;
}

export class UpdateBabyDto implements UpdateBaby {
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
  birth_date: string;

  @IsString()
  @MaxLength(100)
  birth_place?: string;

  @IsNotEmpty()
  @IsEnum(BabyGender)
  gender: BabyGender;
}

export class RegisterBabyDto extends UpdateBabyDto implements RegisterBaby {
  @IsNotEmpty()
  @IsEnum(BabyRole)
  relation_role: BabyRole;
}

export class AddBabyRelationDto implements AddBabyRelation {
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

export class UpdateBabyRelationDto implements UpdateBabyRelation {
  @IsOptional()
  @IsEnum(BabyAuthority)
  authority?: BabyAuthority;

  @IsOptional()
  @IsEnum(BabyRole)
  role?: BabyRole;
}

export class BabyTimelineDto implements BabyTimeline {
  resources: BabyTimelineEntryDto[];
  pagination?: BabyTimelinePaginationDto;
}

export class BabyTimelineEntryDto implements BabyTimelineEntry {
  id: string;
  type: BabyTimelineType;
  details: unknown;
  achieve_by: string;
  occurred_at: string;
  created_at: string;
  updated_at: string;
}

export class BabyTimelinePaginationDto implements BabyTimelinePagination {
  available_days: string[];
  current_day: string;
  previous_day: string | null;
  next_day: string | null;
}

export class BreastfeedingDto implements Breastfeeding {
  @IsBoolean()
  left: boolean;

  @IsBoolean()
  right: boolean;
}

export class MealDto implements Meal {
  @IsString()
  meal: string;

  @IsString()
  @IsOptional()
  note?: string;
}

export class BabyBottleDto implements BabyBottle {
  @IsNumber()
  quantity: number;

  @IsString()
  @IsEnum(BabyBottleUnitType)
  unit: BabyBottleUnit;

  @IsString()
  @IsOptional()
  note?: string;
}

export class ActivityDto implements Activity {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class DiaperDto implements Diaper {
  @IsBoolean()
  pee: boolean;

  @IsBoolean()
  poop: boolean;

  @IsString()
  @IsOptional()
  note?: string;
}

export class MedicineDto implements Medicine {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  dosage?: string;

  @IsString()
  @IsOptional()
  note?: string;
}

export class NapDto implements Nap {
  @IsInt()
  duration_minutes: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class NoteDto implements Note {
  @IsString()
  content: string;
}

export const BabyTimelineDetailsDtos: BabyTimelineTypeDetail = {
  MEAL: MealDto,
  BREASTFEEDING: BreastfeedingDto,
  BABY_BOTTLE: BabyBottleDto,
  ACTIVITY: ActivityDto,
  DIAPER: DiaperDto,
  MEDICINE: MedicineDto,
  NAP: NapDto,
  NOTE: NoteDto,
};

export class GetTimelineQueryDto implements GetTimelineQuery {
  @IsDateString()
  @IsOptional()
  day?: string;

  @IsString()
  @IsOptional()
  type?: BabyTimelineType;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  order: 'asc' | 'desc' = 'asc';
}

export class AddOrUpdateTimelineEntryDto implements AddOrUpdateTimelineEntry {
  @IsNotEmpty()
  @IsEnum(BabyTimelineType)
  type: BabyTimelineType;

  @IsNotEmpty()
  @ValidateBy(
    {
      name: 'timeline-detail-validator',
      validator: {
        async validate(value: any, args?: ValidationArguments): Promise<boolean> {
          if (!value) return false;
          const type = args?.object['type'];
          const DtoClass = BabyTimelineDetailsDtos[type];
          if (!DtoClass) return false;
          const dto = plainToInstance(DtoClass, value);
          return (await validate(dto)).length === 0;
        },
      },
    },
    { message: (args) => `details object has not expected schema for type ${args.object['type']}` }
  )
  details: unknown;

  @IsNotEmpty()
  @IsDateString()
  occurredAt: string;
}
