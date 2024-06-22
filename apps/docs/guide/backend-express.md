# Backend Express

## Installation

Via a package manager:

::: code-group

```bash [npm]
npm install rcu-express
```

```bash [yarn]
yarn add rcu-express
```

```bash [pnpm]
pnpm add rcu-express
```

:::

## Usage

Add middleware:

```js
import { resumableChunkUpload } from "rcu-express";

// ...

app.use(resumableChunkUpload());

// ...
```

`resumableChunkUpload` takes a parameter of type [RCUConfig](#rcuconfig).

## API

### RCUConfig <Badge type="info" text="interface" />

```ts
export type RCUConfig = {
  store?: StoreProviderInterface;
  tmpDir?: string;
  outputDir?: string;
  uploadStatusPath?: string;
  uploadPath?: string;
  onCompleted?: (data: { outputFile: string; fileId: string }) => Promise<void>;
};
```

#### store

- Type: `StoreProviderInterface`
- Default: `JsonStoreProvider`

The `store` parameter is used to store information about the upload, such as the number of the last uploaded chunk, the total number of chunks, etc. The default store is JSON, but you can implement your own by implementing the [StoreProviderInterface](#storeproviderinterface).

#### uploadStatusPath

- Type: `string`
- Default: `/uploadStatus`

Path to retrieve the upload status.

#### uploadPath

- Type: `string`
- Default: `/upload`

Path to upload all chunks.

#### tmpDir

- Type: `string`
- Default: `./tmp`

Directory to save all binary chunks.

#### outputDir

- Type: `string`
- Default: `./tmp`

Directory to save the complete file.

#### onCompleted

- Type: `(data: { outputFile: string; fileId: string }) => Promise<void>`

This callback function can be used to perform any additional actions or operations after the upload is completed, such as updating a database record or sending a notification.

- `outputFile`: Path of the uploaded file.
- `fileId`: The ID of the file used to identify the upload. This is specified from [frontend](/guide/frontend-api#setfileid).

### StoreProviderInterface <Badge type="info" text="interface" />

```ts
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
```
