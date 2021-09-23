import { SetMetadata, applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { KeycloakAuthenticatedGuard } from '../guards';

/**
 *
 * Usesr autheticated
 *
 * @param roles user in role
 */
export const Authenticated = (...roles: string[]) => {
  return applyDecorators(
    SetMetadata('authorized-roles', roles),
    UseGuards(KeycloakAuthenticatedGuard)
    // ApiBearerAuth(),
    // ApiUnauthorizedResponse({ description: 'Unauthorized"' }),
  );
};
