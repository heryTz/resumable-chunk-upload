import {
  JsonStoreProvider,
  RCUService,
  ResumableChunkUploadConfig,
} from "rcu-back-core";
import { handler } from "./handler";

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
  ResumableChunkUploadConfig,
} from "rcu-back-core";
