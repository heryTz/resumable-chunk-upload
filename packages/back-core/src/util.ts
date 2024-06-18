import { readFile, access, mkdir, writeFile } from "fs/promises";
import path from "path";

export async function readOrCreateFile(
  filePath: string,
  defaultData = ""
): Promise<string> {
  try {
    await access(filePath);
  } catch (error) {
    const dir = path.dirname(filePath);
    await mkdir(dir, { recursive: true });
    await writeFile(filePath, defaultData);
  }
  const data = await readFile(filePath);
  return data.toString() || defaultData;
}
