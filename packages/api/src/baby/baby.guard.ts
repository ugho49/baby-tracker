import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BabyAuthority, BabyAuthorityTypes } from '@baby-tracker/common-types';
import { uniq } from 'lodash';
import { IAuthUser } from '../auth';
import { BabyService } from './baby.service';

const metadataKey = 'authority';
type MetadataParamType = {
  authorities: BabyAuthority[];
  idParamName: string;
};

const parentAuthorityGraph: { [key in BabyAuthorityTypes]: BabyAuthority[] } = {
  ROLE_ADMIN: [],
  ROLE_WRITE_USER: [BabyAuthority.ROLE_ADMIN],
  ROLE_READ_USER: [BabyAuthority.ROLE_ADMIN, BabyAuthority.ROLE_WRITE_USER],
};

@Injectable()
export class BabyAuthorityGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly babyService: BabyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { authorities, idParamName } = this.reflector.get<MetadataParamType>(metadataKey, context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (!request.params.hasOwnProperty(idParamName)) {
      throw new InternalServerErrorException(`Unable to find '${idParamName}' path param`);
    }

    if (!authorities || authorities.length === 0) {
      return true;
    }

    const grantedAuthorities = uniq(
      authorities.reduce((acc, val) => [...acc, ...parentAuthorityGraph[val]], authorities)
    );

    const user = request.user as IAuthUser;
    const babyId = request.params[idParamName];

    const relation = await this.babyService.getBabyRelation(babyId, user.userId);

    if (!relation) {
      throw new NotFoundException('Baby not found');
    }

    const relationAuthority = BabyAuthority[relation.authority];

    if (!grantedAuthorities.includes(relationAuthority)) {
      throw new ForbiddenException();
    }

    request.relation = relation;

    return true;
  }
}

export function HasBabyAuthorities(
  authorities: BabyAuthority[] = [BabyAuthority.ROLE_READ_USER],
  idParamName: string = 'babyId'
) {
  return applyDecorators(
    SetMetadata<string, MetadataParamType>(metadataKey, { authorities, idParamName }),
    UseGuards(BabyAuthorityGuard)
  );
}
