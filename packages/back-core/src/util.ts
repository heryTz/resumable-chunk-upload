import { readFile, access, mkdir, writeFile } from "fs/promises";
import path from "path";

export async function readOrCreateFile(filePath: string): Promise<string> {
  try {
    await access(filePath);
  } catch (error) {
    const dir = path.dirname(filePath);
    await mkdir(dir, { recursive: true });
    await writeFile(filePath, "{}");
  }
  const data = await readFile(filePath);
  return data.toString() || "{}";
}
