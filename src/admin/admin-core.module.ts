import { Module, DynamicModule } from '@nestjs/common';
import { KeycloakAdminOptions } from '../ifaces';
import { KeycloakConfigAdapter } from '../adapters';
import { KeycloakAdminService } from './keycloak-admin.service';

@Module({
  providers: [KeycloakAdminService],
  exports: [KeycloakAdminService],
})
export class KeycloakAdminCoreModule {

  static forRoot(ops: KeycloakAdminOptions): DynamicModule {

    const providers = [{
      provide: KeycloakAdminOptions,
      useFactory: async(): Promise<KeycloakAdminOptions> => {
        const cadapter = new KeycloakConfigAdapter(ops);
        return cadapter.resolve();
      }
    }];

    return {
      global: true,
      module: KeycloakAdminCoreModule,
      providers: providers,
      exports: providers,
    };

  }

}
