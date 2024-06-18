import { unlinkSync, writeFileSync } from "fs";
import type { StoreProviderInterface, Upload } from "./contract";
import { readOrCreateFile } from "./util";

type JsonData = {
  rows: Upload[];
};
const defaultJsonData: JsonData = {
  rows: [],
};

export class JsonStoreProvider implements StoreProviderInterface {
  private rows: Upload[] = [];
  private filePath = "";

  constructor(filePath: string) {
    this.filePath = filePath;
    readOrCreateFile(filePath, JSON.stringify(defaultJsonData))
      .then((content) => {
        const data = JSON.parse(content) as JsonData;
        if (Array.isArray(data.rows)) {
          this.rows = data.rows;
        } else {
          this.rows = [];
          unlinkSync(filePath);
          readOrCreateFile(filePath, JSON.stringify(defaultJsonData)).catch(
            (error) => {
              console.log(
                `Failed to create file ${filePath}: ${error.message}`
              );
            }
          );
        }
      })
      .catch((error) => {
        console.log(`Failed to read file ${filePath}: ${error.message}`);
      });
  }

  async getItem(id: string): Promise<Upload | undefined> {
    return this.rows.find((el) => el.id === id);
  }

  async createItem(id: string, chunkCount: number): Promise<Upload> {
    if (this.rows.find((el) => el.id === id))
      throw `Upload already exist for ${id}`;
    this.rows.push({
      id,
      chunkCount,
      lastUploadedChunkNumber: 0,
      chunkFilenames: [],
    });
    this.persist();
    return (await this.getItem(id))!;
  }

  async updateItem(id: string, update: Partial<Upload>): Promise<Upload> {
    this.rows = this.rows.map((el) => {
      if (el.id === id) return { ...el, ...update };
      return el;
    });
    this.persist();
    return (await this.getItem(id))!;
  }

  async removeItem(id: string): Promise<void> {
    this.rows = this.rows.filter((el) => el.id !== id);
    this.persist();
  }

  persist() {
    writeFileSync(
      this.filePath,
      JSON.stringify({ rows: this.rows } as JsonData)
    );
  }
}
