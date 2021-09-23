import * as https from 'https';
import * as http from 'http';
import { KeycloakAdminOptions, RealmResponse } from '../ifaces';
import { defer, of } from 'rxjs';
import { handleRetry } from '../utils';
import { switchMap } from 'rxjs/operators';

export class KeycloakConfigAdapter {

  private ops: KeycloakAdminOptions;

  constructor(options: KeycloakAdminOptions) {
    this.ops = new KeycloakAdminOptions(options);
  }

  private request<T>(url: string): Promise<T> {
    let request: any = http;
    if (/^https/.test(url)) {
      request = https;
    }

    return new Promise<T>((res, rej) => {
      request.get(url, (resp) => {
        let data = '';

        if (resp.statusCode === 404) {
          return rej(new Error(`Not found`));
        }

        const headers: any = resp.headers || {};

        if (headers['Content-Type'] === 'text/html') {
          return rej(new Error(`Invalid request`));
        }

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Parse the result.
        resp.on('end', () => {
          try {
            const result = JSON.parse(data);
            res(result);
          } catch(error) {
            rej(error);
          }
        });

      }).on("error", (err) => {
        rej(err);
      });
    });
  }

  async resolve(): Promise<KeycloakAdminOptions> {
    if (this.ops.publicKey) {
      return Promise.resolve(this.ops);
    }

    const config = await defer(async () =>
      this.request<any>(`${this.ops.serverUrl}/realms/${this.ops.realm}`)
    )
    .pipe(
      handleRetry(this.ops.retryAttempts, this.ops.retryDelay),
      switchMap(raw => of(new RealmResponse(raw)))
    )
    .toPromise();

    this.ops.publicKey = config.publicKey;
    return Promise.resolve(this.ops);
  }

}
