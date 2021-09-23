import { Injectable } from '@nestjs/common';
import { KeycloakAdminOptions } from '../ifaces';
import { KeycloakAdminAdapter } from './admin.adapter';

@Injectable()
export class KeycloakAdminService extends KeycloakAdminAdapter {

  constructor(ops: KeycloakAdminOptions) {
    super(ops);
  }

}
