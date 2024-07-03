import { DynamicModule, Module } from '@nestjs/common';
import { RCUController } from './rcu.controller';
import { RCUServiceNest } from './rcu.service';
import { RCUServiceConfig } from 'rcu-back-core';
import { RCU_SERVICE_CONFIG, RCU_SERVICE_DEFAULT_CONFIG } from './constant';

@Module({})
export class RCUModule {
  static forRoot(config?: RCUServiceConfig): DynamicModule {
    return {
      module: RCUModule,
      providers: [
        {
          provide: RCU_SERVICE_CONFIG,
          useValue: config ?? RCU_SERVICE_DEFAULT_CONFIG,
        },
        RCUServiceNest,
      ],
      controllers: [RCUController],
    };
  }
}
