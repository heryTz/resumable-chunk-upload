import { JsonStoreProvider, RCUServiceConfig } from 'rcu-back-core';

export const RCU_SERVICE_CONFIG = 'RCU_SERVICE_CONFIG';

export const RCU_SERVICE_DEFAULT_CONFIG: RCUServiceConfig = {
  store: new JsonStoreProvider("./tmp/rcu.json"),
  tmpDir: './tmp',
  outputDir: './tmp',
  onCompleted: null,
};
