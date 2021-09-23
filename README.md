# @nicom/nest-keycloak

Integrate [keycloak](https://www.keycloak.org/) with [Nest](https://nestjs.com/) controllers and manage keycloak with the admin module

## KeycloakModule

This module provide decorators to intercept keycloak tokens

```bash
$ npm i --save @gaucho/nest-keycloak keycloak-connect
```

```ts
// session.ts
import * as expressSession from 'express-session';

// DON'T use this in PRODUCTION
const memoryStore = new expressSession.MemoryStore();

export const session = expressSession({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
})
```

```ts
// main.ts
app.use(session);
```

```ts
// app.module.ts
import { KeycloakModule } from '@gaucho/nest-keycloak';
import { session } from './session';

@Module({
  imports: [
    KeycloakModule.forRoot({
      serverUrl: 'http://localhost:8080/auth',
      realm: 'master',
      clientId: 'admin-cli',
      session
    }),
  ],
  controllers: [SecureController]
})
export class AppModule{}
```

```ts
// secure.controller.ts
import { Authenticated, User, KeycloakUser } from '@gaucho/nest-keycloak';
import { Controller, Get, Post, Put, Delete } from '@nestjs/common';

@Controller()
export class SecureController {

  @Get()
  find(@User() user: KeycloakUser) {
    // if the keycloak token is present user will be a valid keycloak user
    // if not user.isAnonymous() => true
  }

  @Post()
  @Authenticated()
  create(@User() user: KeycloakUser) {
    // Get here if is a valid authentication
  }

  @Put()
  @Authenticated('admin')
  update(@User() user: KeycloakUser) {
    // Get here if is admin
  }


  @Delete()
  @Authenticated('admin', 'superadmin')
  update(@User() user: KeycloakUser) {
    // Get here if is admin or superadmin
  }

}

@Controller()
@Authenticated('admin')
export class AdminController {

  @Put()
  update(@User() user: KeycloakUser) {
    // Get here if is admin
  }


  @Delete()
  @Authenticated('guest') // Override
  update(@User() user: KeycloakUser) {
    // Get here if is guest
  }

}
```

## KeycloakAdminModule


```bash
$ npm i --save @gaucho/nest-keycloak keycloak-admin
```

This module provide an interface to work with ['keycloak-admin'](https://www.npmjs.com/package/keycloak-admin)

```ts
// app.module.ts
import { KeycloakAdminModule } from '@gaucho/nest-keycloak/admin';

@Module({
  imports: [
    KeycloakAdminModule.forRoot({
      serverUrl: 'http://localhost:8080/auth',
      realm: 'master',
      adminPwd: process.env.KEYCLOAK_ADMIN_PASSWORD
    }),
  ],
  providers: [UsersService]
})
export class AppModule{}
```

```ts
// users.service.ts
import { Module, Injectable } from '@nestjs/common';
import KeycloakAdminService from '@gaucho/nest-keycloak/admin';
import KcAdminClient from '@keycloak/keycloak-admin-client';

@Injectable()
export class UsersService {

  constructor(keycloak: KeycloakAdminService) {}

  getUsers(): Promise<any> {
    const client: KcAdminClient = await service.client();
    return client.users.find();
  }

}
```

## Keyclaok admin adapter

```ts
import { KeycloakConfigAdapter } from "@gaucho/nest-keycloak";
import { KeycloakAdminAdapter } from "@gaucho/nest-keycloak/admin";
import KcAdminClient from '@keycloak/keycloak-admin-client';

const cadapter = new KeycloakConfigAdapter({
  serverUrl: 'http://localhost:8080/auth',
  adminPwd: 'admin'
});

const config = await cadapter.resolve();
const adapter = new KeycloakAdminAdapter(config);
const client = await adapter.client();
```
