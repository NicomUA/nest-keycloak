import { Injectable } from '@nestjs/common';
import Keycloak from 'keycloak-connect';
import { get } from 'lodash';
import { KeycloakOptions, KeycloakUser } from '../ifaces';

@Injectable()
export class KeycloakService {

  keycloak: Keycloak.Keycloak;

  constructor(
    private readonly ops: KeycloakOptions,
  ) {
    const kops = {
      'confidential-port': null,
      'resource': null,
      'auth-server-url': ops.serverUrl,
      'ssl-required': ops.sslRequired,
      'bearer-only': ops.bearerOnly,
      realm: ops.realm
    };
    this.keycloak = new Keycloak({ store: ops.session }, kops);
  }

  getGrant(request, response): Promise<Keycloak.Grant> {
    return this.keycloak.getGrant(request, response);
  }

  getUserInfo(grant: Keycloak.Grant): KeycloakUser {
    const udata: any = {};

    if (!grant) {
      // return an anonymous user
      return new KeycloakUser();
    }

    const token = get(grant, 'access_token');
    const content = get(token, 'content');

    const roles = get(content, 'realm_access.roles');

    udata.uid = get(content, 'sub');
    udata.username = get(content, 'preferred_username');
    udata.roles = roles || [];
    udata.email = get(content, 'email');
    udata.emailVerified = get(content, 'email_verified');
    udata.firstName = get(content, 'given_name');
    udata.lastName = get(content, 'family_name');

    return new KeycloakUser(udata);
  }

  userInRoles(user: KeycloakUser, ...roles: string[]): boolean {
    if (!roles || roles.length === 0) {
      return true;
    }
    return roles.some( role => user.roles.indexOf(role) !== -1 );
  }

}
