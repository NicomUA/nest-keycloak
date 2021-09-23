import { KeycloakAdminOptions } from '../ifaces';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Issuer, Client, TokenSet } from 'openid-client';

export class KeycloakAdminAdapter {

  private kclient: KcAdminClient;

  private oclient: Client;

  private tokenSet: TokenSet;

  private refreshExpiration = 0;

  constructor(private ops: KeycloakAdminOptions) {
    this.kclient = new KcAdminClient({
      baseUrl: ops.serverUrl,
      realmName: ops.realm,
    })
  }

  private getOpenIdUrl(): string {
    return `${this.ops.serverUrl}/realms/${this.ops.realm}`;
  }

  private async refreshOClient(): Promise<void> {
    if (this.oclient) {
      return;
    }

    const kurl = this.getOpenIdUrl();
    const keycloakIssuer = await Issuer.discover(kurl);

    this.oclient = new keycloakIssuer.Client({
      client_id: this.ops.clientId,
      client_secret: this.ops.publicKey,
    });
  }

  private refreshExpired(): boolean {
    return this.refreshExpiration === 0 ? false : Date.now() >= this.refreshExpiration;
  }

  private refreshExpirationRefreshToken() {
    const rei = Number(this.tokenSet['refresh_expires_in']) || 0;
    this.refreshExpiration = rei > 0 ? Date.now() + rei * 1000 : 0;
  }

  private async refreshTokenSet(): Promise<void> {
    await this.refreshOClient();

    if (!this.tokenSet || this.refreshExpired()) {
      this.tokenSet = await this.oclient.grant({
        username: this.ops.adminUser,
        password: this.ops.adminPwd,
        grant_type: 'password',
      });
      this.refreshExpirationRefreshToken();
    }

    if (this.tokenSet.expired()) {
      const refreshToken = this.tokenSet.refresh_token;
      this.tokenSet = await this.oclient.refresh(refreshToken);
      this.refreshExpirationRefreshToken();
    }

    this.kclient.setAccessToken(this.tokenSet.access_token);
  }

  /**
   *
   * Get a [Keycloak admin client](https://www.npmjs.com/package/keycloak-admin) ready to work
   *
   * This method update the access token and the refresh token on demand.
   *
   * **WARNING!** Don't use it as a global variable, the access token need to be refreshed every 60 second as default.
   *
   */
  async client(): Promise<KcAdminClient> {
    await this.refreshTokenSet();

    return this.kclient;
  }

}
