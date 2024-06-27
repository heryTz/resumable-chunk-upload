import { readFile, access, mkdir, writeFile, unlink } from "fs/promises";
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

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function deleteFile(filePath: string) {
  try {
    await access(filePath);
    await unlink(filePath);
  } catch (error) {}
}

export async function createDir(dirPath: string) {
  try {
    await access(dirPath);
  } catch (error) {
    await mkdir(dirPath, { recursive: true });
  }
}
