import { BabyAuthority } from '../enums';
import { BabyAuthorityTypes } from '../types';

export const parentAuthorityGraph: { [key in BabyAuthorityTypes]: BabyAuthority[] } = {
  ROLE_ADMIN: [],
  ROLE_WRITE_USER: [BabyAuthority.ROLE_ADMIN],
  ROLE_READ_USER: [BabyAuthority.ROLE_ADMIN, BabyAuthority.ROLE_WRITE_USER],
};

export function hasAuthority(authorityNeeded: BabyAuthority, userAuthority: BabyAuthority): boolean {
  if (authorityNeeded === userAuthority) return true;
  return parentAuthorityGraph[authorityNeeded].includes(userAuthority);
}
