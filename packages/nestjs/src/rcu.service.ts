import { Inject, Injectable } from '@nestjs/common';
import { RCUService, RCUServiceConfig } from 'rcu-back-core';
import { RCU_SERVICE_CONFIG } from './constant';

@Injectable()
export class RCUServiceNest extends RCUService {
  constructor(@Inject(RCU_SERVICE_CONFIG) protected config: RCUServiceConfig) {
    super(config);
  }
}
