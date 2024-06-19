import { JsonStoreData, JsonStoreProvider } from "../json-store-provider";
import { deleteFile, readOrCreateFile, sleep } from "../util";

describe(JsonStoreProvider.name, () => {
  it("get item", async () => {
    const file = "./tmp/test-store-1.json";
    await deleteFile(file);
    await readOrCreateFile(
      file,
      JSON.stringify({
        rows: [
          {
            id: "1",
            chunkCount: 1,
            chunkFilenames: ["1-chunk.jpg"],
            lastUploadedChunkNumber: 0,
          },
        ],
      } as JsonStoreData)
    );
    const store = new JsonStoreProvider(file);
    await sleep(100);
    const item = await store.getItem("1");
    expect(item?.id).toBe("1");
  });

  it("create item", async () => {
    const file = "./tmp/test-store-2.json";
    await deleteFile(file);
    await readOrCreateFile(file, JSON.stringify({ rows: [] } as JsonStoreData));
    const store = new JsonStoreProvider(file);
    await sleep(100);
    await store.createItem("1", 2);
    const item = await store.getItem("1");
    expect(item?.id).toBe("1");
  });

  it("cannot create item with existing id", async () => {
    const file = "./tmp/test-store-3.json";
    await deleteFile(file);
    await readOrCreateFile(
      file,
      JSON.stringify({
        rows: [
          {
            id: "1",
            chunkCount: 1,
            chunkFilenames: ["1-chunk.jpg"],
            lastUploadedChunkNumber: 0,
          },
        ],
      } as JsonStoreData)
    );
    const store = new JsonStoreProvider(file);
    await sleep(100);
    expect(store.createItem("1", 2)).rejects.toThrow(
      `Upload already exist for 1`
    );
  });

  it("update item", async () => {
    const file = "./tmp/test-store-4.json";
    await deleteFile(file);
    await readOrCreateFile(
      file,
      JSON.stringify({
        rows: [
          {
            id: "1",
            chunkCount: 4,
            chunkFilenames: ["1-chunk.jpg"],
            lastUploadedChunkNumber: 0,
          },
        ],
      } as JsonStoreData)
    );
    const store = new JsonStoreProvider(file);
    await sleep(100);
    await store.updateItem("1", {
      lastUploadedChunkNumber: 2,
      chunkFilenames: ["1-chunk.jpg", "2-chunk.jpg"],
    });
    const item = await store.getItem("1");
    expect(item).toEqual({
      id: "1",
      chunkCount: 4,
      chunkFilenames: ["1-chunk.jpg", "2-chunk.jpg"],
      lastUploadedChunkNumber: 2,
    });
  });

  it("delete item", async () => {
    const file = "./tmp/test-store-5.json";
    await deleteFile(file);
    await readOrCreateFile(
      file,
      JSON.stringify({
        rows: [
          {
            id: "1",
            chunkCount: 1,
            chunkFilenames: ["1-chunk.jpg"],
            lastUploadedChunkNumber: 0,
          },
        ],
      } as JsonStoreData)
    );
    const store = new JsonStoreProvider(file);
    await sleep(100);
    await store.removeItem("1");
    const item = await store.getItem("1");
    expect(item).toBeUndefined();
  });
});
