import { DynamicModule, Module } from '@nestjs/common';
import { RCUController } from './rcu.controller';
import { RCUServiceNest } from './rcu.service';
import { RCU_SERVICE_CONFIG, RCU_MODULE_DEFAULT_CONFIG } from './constant';
import {
  OnCompletedInterface,
  RCUServiceNestConfig,
  RCUModuleConfig,
} from './contract';

@Module({})
export class RCUModule {
  static forRoot(
    config: RCUModuleConfig = RCU_MODULE_DEFAULT_CONFIG,
  ): DynamicModule {
    const {
      onCompletedService,
      imports = [],
      providers = [],
      ...rest
    } = config;
    return {
      module: RCUModule,
      imports,
      providers: [
        {
          provide: RCU_SERVICE_CONFIG,
          useFactory: (
            onCompletedService: OnCompletedInterface,
          ): RCUServiceNestConfig => {
            return {
              ...rest,
              onCompleted: onCompletedService,
            };
          },
          inject: [onCompletedService],
        },
        RCUServiceNest,
        onCompletedService,
        ...providers,
      ],
      controllers: [RCUController],
      exports: [RCUServiceNest, onCompletedService, ...providers],
    };
  }
}
