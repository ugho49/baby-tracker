import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthUser } from '../auth.interface';

export const AuthUser = createParamDecorator((data: keyof IAuthUser, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as IAuthUser;
  return data ? user?.[data] : user;
});
