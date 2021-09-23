export class KeycloakAdminOptions {
  serverUrl: string;
  realm? = 'master';
  clientId? = 'admin-cli';
  publicKey?: string;
  bearerOnly? = true;
  sslRequired? = 'external';
  adminUser? = 'admin';
  adminPwd: string;
  retryAttempts? = 9;
  retryDelay? = 3000;

  constructor(ops: any) {
    Object.assign(this, ops);
  }
}
