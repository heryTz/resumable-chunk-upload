import { FastifyInstance } from "fastify";
import multipart from "@fastify/multipart";

export function makeRoute() {
  return async function routes(fastify: FastifyInstance) {
    fastify.register(multipart);

    fastify.get("/uploadStatus", async (request, reply) => {
      return { hello: "world, uploadStatusPath" };
    });

    fastify.post("/upload", async (request, reply) => {
      const file = await request.file();
      console.log({ file, body: request.body });
      return { hello: "world, uploadPath" };
    });
  };
}
