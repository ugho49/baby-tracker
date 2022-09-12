import { BabyAuthority, BabyRole, BabyGender, BabyTimelineType, DiaperType } from '../enums';

export type BabyAuthorityTypes = keyof typeof BabyAuthority;
export type BabyRoleTypes = keyof typeof BabyRole;
export type BabyGenderTypes = keyof typeof BabyGender;
export type DiaperTypeTypes = keyof typeof DiaperType;
export type BabyTimelineTypeTypes = keyof typeof BabyTimelineType;
export type BabyTimelineTypeDetail = { [key in BabyTimelineType]: unknown };

export type Baby = {
  id: string;
  firstname: string;
  lastname: string;
  birth_date: Date;
  birth_place?: string;
  created_at: Date;
  updated_at: Date;
};

export type RoleAuthority = {
  authority: BabyAuthority;
  role: BabyRole;
};

export type BabyWithUserAuthority = Baby & {
  relation: RoleAuthority;
};

export type BabyRelation = RoleAuthority & {
  id: string;
  firstname: string;
  lastname: string;
};

export type BabyWithRelations = Baby & {
  relations: BabyRelation[];
};

export type BabyRelationId = {
  relation_id: string;
};

export type UpdateBaby = {
  firstname: string;
  lastname: string;
  birth_date: Date;
  birth_place?: string;
  gender: BabyGender;
};

export type RegisterBaby = UpdateBaby & {
  relation_role: BabyRole;
};

export type AddBabyRelation = {
  email: string;
  authority: BabyAuthority;
  role: BabyRole;
};

export type UpdateBabyRelation = {
  authority?: BabyAuthority;
  role?: BabyRole;
};
