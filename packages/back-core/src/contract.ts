export type Upload = {
  id: string;
  chunkCount: number;
  lastUploadedChunkNumber: number;
  chunkFilenames: string[];
};

export interface StoreProviderInterface {
  getItem(id: string): Promise<Upload | undefined>;
  createItem(id: string, chunkCount: number): Promise<Upload>;
  updateItem(id: string, update: Partial<Upload>): Promise<Upload>;
  removeItem(id: string): Promise<void>;
}
