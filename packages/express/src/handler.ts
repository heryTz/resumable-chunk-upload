import { Request, Response, NextFunction, Router } from "express";
import { RCUConfig, RCUServiceInterface } from "rcu-back-core";
import { ZodError, z } from "zod";
import multer from "multer";

const uploadStatusSchema = z.object({
  fileId: z.string().min(1),
  chunkCount: z.coerce.number(),
});

const uploadSchema = z.object({
  fileId: z.string().min(1),
  chunkNumber: z.number(),
  originalFilename: z.string().min(1),
  chunkCount: z.number(),
  chunkSize: z.number(),
  fileSize: z.number(),
  file: z.instanceof(Buffer),
});

export function handler(
  service: RCUServiceInterface,
  config?: Pick<RCUConfig, "uploadPath" | "uploadStatusPath">
): Router {
  const { uploadStatusPath = "/uploadStatus", uploadPath = "/upload" } =
    config ?? {};

  const multerUpload = multer();
  const router = Router();

  router.get(uploadStatusPath, async (req: Request, res: Response) => {
    try {
      const query = uploadStatusSchema.parse(req.query);
      const response = await service.uploadStatus(query);
      return res.json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).send({ message: "Invalid parameter" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.post(
    uploadPath,
    multerUpload.single("file"),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = await uploadSchema.parse({
          ...req.body,
          file: req.file?.buffer,
        });
        const response = await service.upload(dto);
        return res.json(response);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).send({ message: "Invalid parameter" });
        }
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  return router;
}
