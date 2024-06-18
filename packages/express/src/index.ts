import {
  JsonStoreProvider,
  RCUService,
  StoreProviderInterface,
} from "rcu-back-core";
import { HandlerConfig, handler } from "./handler";

export type ResumableChunkUploadConfig = HandlerConfig & {
  store?: StoreProviderInterface;
  tmpDir?: string;
  outputDir?: string;
};

export function resumableChunkUpload(config: ResumableChunkUploadConfig) {
  const {
    store = new JsonStoreProvider("./tmp/rcu.json"),
    tmpDir = "./tmp",
    outputDir,
  } = config;
  return handler(new RCUService(store, tmpDir, outputDir ?? tmpDir), config);
}

export {
  JsonStoreProvider,
  StoreProviderInterface,
  Upload,
} from "rcu-back-core";
