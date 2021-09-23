export class RealmResponse {
  realm: string;
  publicKey: string;
  tokenService: string;
  accountService: string;
  tokensNotBefore: number;

  constructor(response: any = {}) {
    this.realm = response['realm'];
    this.publicKey = response['public_key'];
    this.tokenService = response['token-service'];
    this.accountService = response['account-service'];
    this.tokensNotBefore = response['tokens-not-before'];
  }

}
