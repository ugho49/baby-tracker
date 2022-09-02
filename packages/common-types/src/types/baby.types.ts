import { BabyAuthority, BabyRole, BabyGender, BabyTimelineType, DiaperType } from '../enums';

export type BabyAuthorityTypes = keyof typeof BabyAuthority;
export type BabyRoleTypes = keyof typeof BabyRole;
export type BabyGenderTypes = keyof typeof BabyGender;
export type DiaperTypeTypes = keyof typeof DiaperType;
export type BabyTimelineTypeTypes = keyof typeof BabyTimelineType;
export type BabyTimelineTypeDetail = { [key in BabyTimelineType]: unknown };
