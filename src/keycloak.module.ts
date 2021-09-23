import { Module, DynamicModule } from '@nestjs/common';
import { KeycloakCoreModule } from './keycloak-core.module';
import { KeycloakOptions } from './ifaces';

@Module({})
export class KeycloakModule {

  /**
   *
   * Configure the KeycloakModule
   *
   * @param ops Connection and realm setting for keycloak
   */
  static forRoot(ops: KeycloakOptions): DynamicModule {

    return {
      module: KeycloakModule,
      imports: [
        KeycloakCoreModule.forRoot(ops)
      ]
    };

  }

}
