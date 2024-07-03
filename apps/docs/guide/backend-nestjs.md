# NestJS

## Installation

Via a package manager:

::: code-group

```bash [npm]
npm install rcu-nestjs
```

```bash [yarn]
yarn add rcu-nestjs
```

```bash [pnpm]
pnpm add rcu-nestjs
```

:::

## Usage

Import the `RCUModule` into your application's root module:

```ts
import { Module } from '@nestjs/common';
import { RCUModule } from 'rcu-nestjs';

@Module({
  imports: [RCUModule.forRoot()],
  // ...
})
export class AppModule {}
```

`RCUModule.forRoot()` method accepts a configuration object of type [RCUServiceConfig](#RCUServiceConfig) to customize the behavior of the module.

## API

### RCUServiceConfig <Badge type="info" text="interface" />

```ts
export type RCUServiceConfig = {
  store: StoreProviderInterface;
  tmpDir: string;
  outputDir: string;
  onCompleted: (data: {
    outputFile: string;
    fileId: string;
  }) => Promise<void>;
};
```

#### store

- Type: `StoreProviderInterface`
- Default: `JsonStoreProvider`

The `store` parameter is used to store information about the upload, such as the number of the last uploaded chunk, the total number of chunks, etc. The default store is JSON, but you can implement your own by implementing the [StoreProviderInterface](#storeproviderinterface).

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
