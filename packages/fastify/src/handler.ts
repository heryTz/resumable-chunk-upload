import { RCUConfig, RCUServiceInterface } from "rcu-back-core";
import { ZodError, z } from "zod";
import { FastifyInstance, FastifyError } from "fastify";
import multipart from "@fastify/multipart";

const uploadStatusSchema = z.object({
  fileId: z.string().min(1),
  chunkCount: z.coerce.number(),
});

const uploadSchema = z.object({
  fileId: z.string().min(1),
  chunkNumber: z.coerce.number(),
  originalFilename: z.string().min(1),
  chunkCount: z.coerce.number(),
  chunkSize: z.coerce.number(),
  fileSize: z.coerce.number(),
  file: z.instanceof(Buffer),
});

// TODO: fix this error when running the tests
// Property 'get' does not exist on type 'FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProviderDefault>'.
// This is a temporary fix
type CustomFastifyInstance = any;
type CustomFastifyRequest = any;
type CustomFastifyReply = any;

export function handler(
  service: RCUServiceInterface,
  config?: Pick<RCUConfig, "uploadPath" | "uploadStatusPath">
) {
  const { uploadStatusPath = "/uploadStatus", uploadPath = "/upload" } =
    config ?? {};

  return async (fastify: CustomFastifyInstance) => {
    fastify.register(multipart, { attachFieldsToBody: true });

    fastify.get(
      uploadStatusPath,
      async (request: CustomFastifyRequest, reply: CustomFastifyReply) => {
        try {
          const query = uploadStatusSchema.parse(request.query);
          const response = await service.uploadStatus(query);
          return reply.send(response);
        } catch (error) {
          if (error instanceof ZodError) {
            return reply.status(400).send({ message: "Invalid parameter" });
          }
          return reply.status(500).send({ message: "Internal server error" });
        }
      }
    );

    fastify.post(
      uploadPath,
      async (request: CustomFastifyRequest, reply: CustomFastifyReply) => {
        try {
          const originalBody = (request.body ?? {}) as any;
          const body = Object.fromEntries(
            Object.keys(originalBody).map((key) => [
              key,
              originalBody[key].value,
            ])
          );
          const dto = await uploadSchema.parse({
            ...body,
            file: await originalBody.file?.toBuffer(),
          });
          const response = await service.upload(dto);
          return reply.send(response);
        } catch (error) {
          if (
            (error as FastifyError).code ===
            "FST_INVALID_MULTIPART_CONTENT_TYPE"
          ) {
            return reply.status(400).send({ message: "Invalid parameter" });
          }
          if (error instanceof ZodError) {
            return reply.status(400).send({ message: "Invalid parameter" });
          }
          return reply.status(500).send({ message: "Internal server error" });
        }
      }
    );
  };
}
