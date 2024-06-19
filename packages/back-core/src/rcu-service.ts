import { access, readFile, unlink, writeFile } from "fs/promises";
import { createWriteStream } from "fs";
import { join } from "path";
import {
  RCUConfig,
  RCUServiceInterface,
  UploadDto,
  UploadStatusQuery,
} from "./contract";

type Config = Required<Pick<RCUConfig, "store" | "tmpDir" | "outputDir">> &
  Pick<RCUConfig, "onCompleted">;

export class RCUService implements RCUServiceInterface {
  constructor(private config: Config) {}

  async uploadStatus(query: UploadStatusQuery) {
    const { store } = this.config;
    const { fileId, chunkCount } = query;
    const uploadInfo = await store.getItem(fileId);

    if (!uploadInfo) {
      const newUpload = await store.createItem(fileId, chunkCount);
      // the last chunk is zero if the upload does not yet exist
      return { lastChunk: newUpload.lastUploadedChunkNumber };
    }

    // Some validation
    if (uploadInfo && chunkCount !== uploadInfo.chunkCount) {
      await store.removeItem(fileId);
      const newUpload = await store.createItem(fileId, chunkCount);
      return { lastChunk: newUpload.lastUploadedChunkNumber };
    }

    return { lastChunk: uploadInfo.lastUploadedChunkNumber };
  }

  async upload(dto: UploadDto) {
    const { store, tmpDir, outputDir, onCompleted } = this.config;
    const { fileId, chunkNumber, file, originalFilename } = dto;
    let uploadInfo = await store.getItem(fileId);
    if (!uploadInfo) throw new Error(`Invalid upload info ${fileId}`);

    const chunkId = `${chunkNumber}-${fileId}`;
    await writeFile(join(tmpDir, chunkId), file);

    uploadInfo = await store.updateItem(fileId, {
      chunkFilenames: uploadInfo.chunkFilenames.concat(chunkId),
      lastUploadedChunkNumber: chunkNumber,
    });

    if (uploadInfo.chunkCount > chunkNumber) {
      return { message: "Chunk uploaded" };
    }

    const outputFile = join(outputDir, originalFilename);
    const combinedFile = createWriteStream(outputFile);

    for (const chunk of uploadInfo.chunkFilenames) {
      try {
        const chunkPath = join(tmpDir, chunk);
        await access(chunkPath);
        let data = await readFile(chunkPath);
        combinedFile.write(data);
        unlink(chunkPath).catch((error) => {
          console.log(`Cannot delete chunk ${chunk} of id ${chunkId}`, error);
        });
      } catch (error) {
        await unlink(outputFile);
        combinedFile.end();
        await store.removeItem(fileId);
        throw new Error(`File corrupted`);
      }
    }

    // TODO: validate combined file (eg: by file size)
    combinedFile.end();
    await store.removeItem(fileId);
    if (onCompleted) {
      onCompleted({ outputFile, fileId });
    }

    return { message: "Upload complete", outputFile };
  }
}
