import Fastify from "fastify";
import { resumableChunkUpload } from "rcu-fastify";
import { makeRoute } from "./routes.js";

const fastify = Fastify({
  logger: true,
});

// fastify.register(resumableChunkUpload());
fastify.register(makeRoute());

fastify.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

try {
  await fastify.listen({ port: 9000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
