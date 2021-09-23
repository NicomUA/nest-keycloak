export class KeycloakOptions {
  serverUrl: string;
  realm: string;
  clientId: string;
  bearerOnly? = true;
  sslRequired? = 'external';

  // an valid express-session
  session?: any = {};

  constructor(ops: any) {
    Object.assign(this, ops);
  }
}
