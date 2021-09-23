import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { KeycloakService } from '../services/keycloak.service';

@Injectable()
export class KeycloakGrantAttacherMiddleware implements NestMiddleware {

  private readonly logger = new Logger('KeycloakGrantAttacherMiddleware');

  constructor(
    private readonly service: KeycloakService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    try {
      req.user = null;
      if (req.headers.authorization) {
        req.userGrant = await this.service.getGrant(req, res);
        req.user = this.service.getUserInfo(req.userGrant);
      }
    } catch (error) {
      const trace = error ? error.stack : undefined;
      this.logger.error(`Fail trying to get grant`, trace);
    }
    next();
  }
}
