import { Module, DynamicModule } from '@nestjs/common';
import { KeycloakAdminOptions } from '../ifaces';
import { KeycloakAdminCoreModule } from './admin-core.module';

@Module({})
export class KeycloakAdminModule {

  /**
   *
   * Configure the KeycloakModule
   *
   * @param ops Connection and realm setting for keycloak
   */
  static forRoot(ops: KeycloakAdminOptions): DynamicModule {

    return {
      module: KeycloakAdminModule,
      imports: [
        KeycloakAdminCoreModule.forRoot(ops)
      ]
    };

  }

}
