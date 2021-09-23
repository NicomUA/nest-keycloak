import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { KeycloakUser } from '../ifaces';

export const User = createParamDecorator( (data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user || new KeycloakUser();
});
