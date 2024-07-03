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

export type RCUConfig = {
  store?: StoreProviderInterface;
  tmpDir?: string;
  outputDir?: string;
  uploadStatusPath?: string;
  uploadPath?: string;
  onCompleted?: (data: { outputFile: string; fileId: string }) => Promise<void>;
};

export type RCUServiceConfig = Required<Pick<RCUConfig, "store" | "tmpDir" | "outputDir">> &
  Pick<RCUConfig, "onCompleted">;

export type UploadStatusQuery = {
  chunkCount: number;
  fileId: string;
};

export type UploadDto = {
  fileId: string;
  chunkNumber: number;
  originalFilename: string;
  chunkCount: number;
  chunkSize: number;
  fileSize: number;
  file: Buffer;
};

export interface RCUServiceInterface {
  uploadStatus(query: UploadStatusQuery): Promise<{ lastChunk: number }>;
  upload(dto: UploadDto): Promise<{ message: string; outputFile?: string }>;
}
