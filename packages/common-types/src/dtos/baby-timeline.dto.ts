import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  validate,
  ValidateBy,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { BabyTimelineTypeDetail } from '../types';
import { BabyTimelineType, DiaperType } from '../enums';
import { plainToInstance, Type } from 'class-transformer';

export class Breastfeading {
  @IsBoolean()
  left: boolean;

  @IsBoolean()
  right: boolean;
}

export class Meal {
  @ValidateNested()
  @ValidateIf((o) => o.quantity === undefined || o.breast)
  @Type(() => Breastfeading)
  breast: Breastfeading;

  @IsString()
  @ValidateIf((o) => o.breast === undefined || o.quantity)
  quantity: string;

  @IsString()
  @IsOptional()
  note?: string;
}

export class Activity {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class Diaper {
  @IsEnum(DiaperType)
  type: DiaperType;

  @IsString()
  @IsOptional()
  note?: string;
}

export class Medicine {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  dosage?: string;

  @IsString()
  @IsOptional()
  note?: string;
}

export class Nap {
  @IsInt()
  duration_minutes: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class Note {
  @IsString()
  content: string;
}

export const BabyTimelineDetailsDtos: BabyTimelineTypeDetail = {
  MEAL: Meal,
  ACTIVITY: Activity,
  DIAPER: Diaper,
  MEDICINE: Medicine,
  NAP: Nap,
  NOTE: Note,
};

export class GetTimelineQueryDto {
  @IsString()
  day?: string;

  @IsString()
  type?: string;
}

export class AddTimelineEntryDto {
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
          const type = args.object['type'];
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
  occurredAt: Date;
}
