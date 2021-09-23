import { DynamicModule, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { KeycloakService } from './services';
import { KeycloakOptions } from './ifaces';
import { KeycloakGrantAttacherMiddleware } from './middlewares';

@Module({
  providers: [KeycloakService],
  exports: [KeycloakService]
})
export class KeycloakCoreModule implements NestModule {

  static forRoot(ops: KeycloakOptions): DynamicModule {
    return {
      global: true,
      module: KeycloakCoreModule,
      providers: [
        { provide: KeycloakOptions, useValue: new KeycloakOptions(ops) }
      ],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(KeycloakGrantAttacherMiddleware)
      .forRoutes('*');
  }

}
