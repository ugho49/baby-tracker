import { BabyAuthority, BabyGender, BabyRole, BabyTimelineType } from '../enums';

export type BabyAuthorityTypes = keyof typeof BabyAuthority;
export type BabyRoleTypes = keyof typeof BabyRole;
export type BabyGenderTypes = keyof typeof BabyGender;
export type BabyTimelineTypeTypes = keyof typeof BabyTimelineType;
export type BabyTimelineTypeDetail = { [key in BabyTimelineType]: unknown };

export type Baby = {
  id: string;
  firstname: string;
  lastname: string;
  birth_date: string;
  birth_place?: string;
  gender: BabyGender;
  created_at: string;
  updated_at: string;
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
  birth_date: string;
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
