import { JsonStoreProvider, RCUService, RCUConfig } from "rcu-back-core";
import { handler } from "./handler";

export function resumableChunkUpload(config: RCUConfig) {
  const {
    store = new JsonStoreProvider("./tmp/rcu.json"),
    tmpDir = "./tmp",
    outputDir,
    onCompleted,
  } = config;
  return handler(
    new RCUService({
      store,
      tmpDir,
      outputDir: outputDir ?? tmpDir,
      onCompleted,
    }),
    config
  );
}

export {
  JsonStoreProvider,
  StoreProviderInterface,
  Upload,
  RCUConfig,
} from "rcu-back-core";
