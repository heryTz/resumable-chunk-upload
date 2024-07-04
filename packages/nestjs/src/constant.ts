import { JsonStoreProvider } from 'rcu-back-core';
import { RCUModuleConfig } from './contract';
import { OnCompletedServiceDefault } from './on-completed-default.service';

export const RCU_SERVICE_CONFIG = 'RCU_SERVICE_CONFIG';

export const RCU_MODULE_DEFAULT_CONFIG: RCUModuleConfig = {
  store: new JsonStoreProvider('./tmp/rcu.json'),
  tmpDir: './tmp',
  outputDir: './tmp',
  onCompletedService: OnCompletedServiceDefault,
  providers: [OnCompletedServiceDefault],
};
