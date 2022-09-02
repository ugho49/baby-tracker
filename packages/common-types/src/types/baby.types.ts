import { BabyAuthority, BabyRole, BabyGender, BabyTimelineType } from '../enums';

export type BabyAuthorityTypes = keyof typeof BabyAuthority;
export type BabyRoleTypes = keyof typeof BabyRole;
export type BabyGenderTypes = keyof typeof BabyGender;
export type BabyTimelineTypeTypes = keyof typeof BabyTimelineType;
