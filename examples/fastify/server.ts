import Fastify from "fastify";
import path from "path";
import { resumableChunkUpload } from "rcu-fastify";

const fastify = Fastify({
  logger: true,
});

fastify.register(import("@fastify/static"), {
  root: path.join(import.meta.dirname, "public"),
});
fastify.register(resumableChunkUpload());

fastify.get("/", async function handler(request, reply) {
  return reply.sendFile("index.html");
});

try {
  await fastify.listen({ port: 9000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
