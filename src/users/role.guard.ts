import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Observable } from 'rxjs';

import Role from './role.enum';

import RequestWithUser from '@/authentication/requestWithUser.interface';

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGurdMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      return user?.roles.includes(role);
    }
  }
  return mixin(RoleGurdMixin);
};
export default RoleGuard;
