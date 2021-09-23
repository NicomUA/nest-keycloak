import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as Keycloak from 'keycloak-connect';
import { KeycloakService } from '../services/keycloak.service';
import { KeycloakUser } from '../ifaces';

@Injectable()
export class KeycloakAuthenticatedGuard implements CanActivate {

  private readonly logger = new Logger('KeycloakAuthenticationGuard');

  constructor(
    private readonly reflector: Reflector,
    private readonly service: KeycloakService,
  ) {}

  async canActivate(
    ctx: ExecutionContext,
  ): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>('authorized-roles', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    const request = ctx.switchToHttp().getRequest();
    const user: KeycloakUser = request.user;

    if (!user || user.isAnonymous()) {
      throw new UnauthorizedException();
    }

    const grant: Keycloak.Grant = request.userGrant;

    if (grant.isExpired()) {
      throw new UnauthorizedException();
    }

    if (this.service.userInRoles(user, ...roles)) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
