import { writeFile } from "fs/promises";
import { JsonStoreData, JsonStoreProvider } from "../json-store-provider";
import { RCUService } from "../rcu-service";
import { deleteFile, readOrCreateFile, sleep } from "../util";

const fileBuffer = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);

describe(RCUService.name, () => {
  it("get last upload status", async () => {
    const file = "./tmp/test-service-1.json";
    await deleteFile(file);
    await readOrCreateFile(
      file,
      JSON.stringify({
        rows: [
          {
            id: "file.txt",
            chunkCount: 4,
            chunkFilenames: ["1-chunk.txt", "2-chunk.txt"],
            lastUploadedChunkNumber: 2,
          },
        ],
      } as JsonStoreData)
    );
    const store = new JsonStoreProvider(file);
    await sleep(100);
    const service = new RCUService(store, "./tmp", "./tmp");
    const response = await service.uploadStatus({
      fileId: "file.txt",
      chunkCount: 4,
    });
    expect(response.lastChunk).toBe(2);
  });

  it("last chunk uploaded should be zero (0) if file ID does not exist", async () => {
    const file = "./tmp/test-service-2.json";
    await deleteFile(file);
    await readOrCreateFile(file, JSON.stringify({ rows: [] } as JsonStoreData));
    const store = new JsonStoreProvider(file);
    await sleep(100);
    const service = new RCUService(store, "./tmp", "./tmp");
    const response = await service.uploadStatus({
      fileId: "file.txt",
      chunkCount: 4,
    });
    expect(response.lastChunk).toBe(0);
  });

  it("return error when upload inexisting file ID", async () => {
    const file = "./tmp/test-service-3.json";
    await deleteFile(file);
    await readOrCreateFile(file, JSON.stringify({ rows: [] } as JsonStoreData));
    const store = new JsonStoreProvider(file);
    await sleep(100);
    const service = new RCUService(store, "./tmp", "./tmp");
    expect(
      service.upload({
        file: fileBuffer,
        fileId: "file.txt",
        chunkCount: 4,
        chunkNumber: 1,
        chunkSize: 1,
        fileSize: 6,
        originalFilename: "file.txt",
      })
    ).rejects.toThrow(`Invalid upload info file.txt`);
  });

  it("chunk uploaded", async () => {
    const file = "./tmp/test-service-4.json";
    await deleteFile(file);
    await readOrCreateFile(
      file,
      JSON.stringify({
        rows: [
          {
            id: "test-chunk-uploaded.txt",
            chunkCount: 4,
            chunkFilenames: [],
            lastUploadedChunkNumber: 0,
          },
        ],
      } as JsonStoreData)
    );
    const store = new JsonStoreProvider(file);
    await sleep(100);
    const service = new RCUService(store, "./tmp", "./tmp");
    const response = await service.upload({
      file: fileBuffer,
      fileId: "test-chunk-uploaded.txt",
      chunkCount: 4,
      chunkNumber: 1,
      chunkSize: 1,
      fileSize: 6,
      originalFilename: "test-chunk-uploaded.txt",
    });
    expect(response.message).toBe("Chunk uploaded");
  });

  it("upload complete", async () => {
    const file = "./tmp/test-service-5.json";
    await deleteFile(file);
    await writeFile("./tmp/1-chunk.txt", "chunk-1-data\n");
    await writeFile("./tmp/2-chunk.txt", "chunk-2-data\n");
    await readOrCreateFile(
      file,
      JSON.stringify({
        rows: [
          {
            id: "test-upload-complete.txt",
            chunkCount: 3,
            chunkFilenames: ["1-chunk.txt", "2-chunk.txt"],
            lastUploadedChunkNumber: 2,
          },
        ],
      } as JsonStoreData)
    );
    const store = new JsonStoreProvider(file);
    await sleep(100);
    const service = new RCUService(store, "./tmp", "./tmp");
    const response = await service.upload({
      file: fileBuffer,
      fileId: "test-upload-complete.txt",
      chunkCount: 3,
      chunkNumber: 3,
      chunkSize: 1,
      fileSize: 6,
      originalFilename: "test-upload-complete.txt",
    });
    expect(response.message).toBe("Upload complete");
  });

  it("file corrupted", async () => {
    const file = "./tmp/test-service-6.json";
    await deleteFile(file);
    await readOrCreateFile(
      file,
      JSON.stringify({
        rows: [
          {
            id: "test-file-corrupted.txt",
            chunkCount: 3,
            chunkFilenames: ["1-chunk.txt", "2-chunk.txt"],
            lastUploadedChunkNumber: 2,
          },
        ],
      } as JsonStoreData)
    );
    const store = new JsonStoreProvider(file);
    await sleep(100);
    const service = new RCUService(store, "./tmp", "./tmp");
    expect(
      service.upload({
        file: fileBuffer,
        fileId: "test-file-corrupted.txt",
        chunkCount: 3,
        chunkNumber: 3,
        chunkSize: 1,
        fileSize: 6,
        originalFilename: "test-file-corrupted.txt",
      })
    ).rejects.toThrow("File corrupted");
  });
});
