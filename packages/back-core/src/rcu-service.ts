import { access, readFile, unlink, writeFile } from "fs/promises";
import { createWriteStream } from "fs";
import { join } from "path";
import { StoreProviderInterface } from "./contract";

type UploadStatusQuery = {
  chunkCount: number;
  fileId: string;
};

type UploadDto = {
  fileId: string;
  chunkNumber: number;
  originalFilename: string;
  chunkCount: number;
  chunkSize: number;
  fileSize: number;
  file: Buffer;
};

export class RCUService {
  constructor(
    private store: StoreProviderInterface,
    private tmpDir: string,
    private outputDir: string
  ) {}

  async uploadStatus(query: UploadStatusQuery) {
    const { fileId, chunkCount } = query;
    const uploadInfo = await this.store.getItem(fileId);

    if (!uploadInfo) {
      const newUpload = await this.store.createItem(fileId, chunkCount);
      // the last chunk is zero if the upload does not yet exist
      return { lastChunk: newUpload.lastUploadedChunkNumber };
    }

    // Some validation
    if (uploadInfo && chunkCount !== uploadInfo.chunkCount) {
      await this.store.removeItem(fileId);
      const newUpload = await this.store.createItem(fileId, chunkCount);
      return { lastChunk: newUpload.lastUploadedChunkNumber };
    }

    return { lastChunk: uploadInfo.lastUploadedChunkNumber };
  }

  async upload(dto: UploadDto) {
    const { fileId, chunkNumber, file, originalFilename } = dto;
    let uploadInfo = await this.store.getItem(fileId);
    if (!uploadInfo) throw new Error(`Invalid upload info ${fileId}`);

    const chunkId = `${chunkNumber}-${fileId}`;
    await writeFile(join(this.tmpDir, chunkId), file);

    uploadInfo = await this.store.updateItem(fileId, {
      chunkFilenames: uploadInfo.chunkFilenames.concat(chunkId),
      lastUploadedChunkNumber: chunkNumber,
    });

    if (uploadInfo.chunkCount > chunkNumber) {
      return { message: "Chunk uploaded" };
    }

    const outputFile = join(this.outputDir, originalFilename);
    const combinedFile = createWriteStream(outputFile);

    for (const chunk of uploadInfo.chunkFilenames) {
      try {
        const chunkPath = join(this.tmpDir, chunk);
        await access(chunkPath);
        let data = await readFile(chunkPath);
        combinedFile.write(data);
        unlink(chunkPath).catch((error) => {
          console.log(`Cannot delete chunk ${chunk} of id ${chunkId}`, error);
        });
      } catch (error) {
        await unlink(outputFile);
        combinedFile.end();
        await this.store.removeItem(fileId);
        throw new Error(`File corrupted`);
      }
    }

    // TODO: validate combined file (eg: by file size)
    combinedFile.end();
    await this.store.removeItem(fileId);

    return { message: "Upload complete", outputFile };
  }
}
