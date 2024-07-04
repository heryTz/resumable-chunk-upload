import { Inject, Injectable } from '@nestjs/common';
import { RCUService } from 'rcu-back-core';
import { RCU_SERVICE_CONFIG } from './constant';
import { RCUServiceNestConfig } from './contract';

@Injectable()
export class RCUServiceNest extends RCUService {
  constructor(
    @Inject(RCU_SERVICE_CONFIG) protected nestConfig: RCUServiceNestConfig,
  ) {
    const { onCompleted, ...rest } = nestConfig;
    super({
      ...rest,
      onCompleted: onCompleted ? onCompleted.handle : null,
    });
  }
}
