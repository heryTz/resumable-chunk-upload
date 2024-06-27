import { RCUServiceInterface } from "rcu-back-core";
import { handler } from "../handler";
import supertest from "supertest";
import fastify from "fastify";

describe(handler.name, () => {
  it("/uploadStatus should throw invalid parameter", async () => {
    const app = fastify();
    const fakeService = {
      uploadStatus: async (query: { chunkCount: number; fileId: string }) => {
        return { lastChunk: 0 };
      },
    } as RCUServiceInterface;
    app.register(handler(fakeService));
    await app.ready();
    const res = await supertest(app.server)
      .get("/uploadStatus")
      .query({ fileId: "", chunkCount: "xx" })
      .send();
    expect(res.status).toBe(400);
    await app.close();
  });

  it("/uploadStatus should return last chunk", async () => {
    const app = fastify();
    const fakeService = {
      uploadStatus: async (query: { chunkCount: number; fileId: string }) => {
        return { lastChunk: 0 };
      },
    } as RCUServiceInterface;
    app.register(handler(fakeService));
    await app.ready();
    const res = await supertest(app.server)
      .get("/uploadStatus")
      .query({ fileId: "file.txt", chunkCount: "1" })
      .send();
    expect(res.body.lastChunk).toBe(0);
    await app.close();
  });

  it("/upload should throw invalid parameter", async () => {
    const app = fastify();
    const fakeService = {
      async uploadStatus() {
        return { lastChunk: 0 };
      },
      async upload() {
        return { message: "success" };
      },
    } as RCUServiceInterface;
    app.register(handler(fakeService));
    await app.ready();
    const res = await supertest(app.server).post("/upload").send();
    expect(res.status).toBe(400);
    await app.close();
  });

  it("/upload should return success message", async () => {
    const app = fastify();
    const fakeService = {
      async uploadStatus() {
        return { lastChunk: 0 };
      },
      async upload() {
        return { message: "success" };
      },
    } as RCUServiceInterface;
    app.register(handler(fakeService));
    await app.ready();
    const res = await supertest(app.server)
      .post("/upload")
      .field("fileId", "package.json")
      .field("chunkNumber", "1")
      .field("originalFilename", "package.json")
      .field("chunkCount", "1")
      .field("chunkSize", "1")
      .field("fileSize", "1")
      .attach("file", Buffer.from("{}"), "package.json");
    expect(res.body.message).toBe("success");
    await app.close();
  });
});
