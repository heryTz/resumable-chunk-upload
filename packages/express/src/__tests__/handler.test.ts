import { RCUServiceInterface } from "rcu-back-core";
import { handler } from "../handler";
import express from "express";
import supertest from "supertest";

describe(handler.name, () => {
  it("/uploadStatus should throw invalid parameter", async () => {
    const app = express();
    const fakeService = {
      uploadStatus: async (query: { chunkCount: number; fileId: string }) => {
        return { lastChunk: 0 };
      },
    } as RCUServiceInterface;
    app.use(handler(fakeService));
    const res = await supertest(app)
      .get("/uploadStatus")
      .query({ fileId: "", chunkCount: "xx" })
      .send();
    expect(res.status).toBe(400);
  });

  it("/upload should throw invalid parameter", async () => {
    const app = express();
    const fakeService = {
      uploadStatus: async (query: { chunkCount: number; fileId: string }) => {
        return { lastChunk: 0 };
      },
    } as RCUServiceInterface;
    app.use(handler(fakeService));
    const res = await supertest(app).post("/upload").send();
    expect(res.status).toBe(400);
  });
});
