import { KeycloakConfigAdapter } from "./config.adapter";
import { KeycloakAdminOptions } from '../ifaces';

describe('KeycloakConfigAdapter', () => {

  const ops = {
    serverUrl: 'http://localhost:8080/auth',
    adminPwd: 'admin'
  };

  it(`should get the realm config`, async () => {

    const adapter = new KeycloakConfigAdapter(ops);

    const config = await adapter.resolve();
    expect(config instanceof KeycloakAdminOptions).toBe(true);
    expect(typeof config.publicKey).toBe('string');

  })


});
