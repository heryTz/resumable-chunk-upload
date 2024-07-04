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

`RCUModule.forRoot()` method accepts a configuration object of type [RCUModuleConfig](#RCUModuleConfig) to customize the behavior of the module.

::: details Example RCUModuleConfig

::: code-group

```ts [app.module.ts] {8-14}
/// ...
import { JsonStoreProvider, RCUModule } from 'rcu-nestjs';
import { LoggingService } from './logging.service';
import { OnCompletedService } from './on-completed.service';

@Module({
  imports: [
    RCUModule.forRoot({
      store: new JsonStoreProvider('./tmp/rcu.json'),
      tmpDir: './tmp',
      outputDir: './tmp',
      onCompletedService: OnCompletedService,
      providers: [LoggingService, OnCompletedService],
    }),
  ],
  /// ...
})
export class AppModule {}
```

```ts [logging.service.ts]
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggingService {
  log(message: string) {
    console.log(message);
  }
}

```

```ts [on-completed.service.ts]
import { Injectable } from '@nestjs/common';
import { OnCompletedInterface } from 'rcu-nestjs';
import { LoggingService } from './logging.service';

@Injectable()
export class OnCompletedService implements OnCompletedInterface {
  constructor(private loggingService: LoggingService) {}

  handle = async ({ outputFile, fileId }) => {
    this.loggingService.log('File completed: ' + fileId);
  };
}
```
:::

## API

### RCUModuleConfig <Badge type="info" text="interface" />

```ts
export type RCUModuleConfig = {
    store: StoreProviderInterface;
    tmpDir: string;
    outputDir: string;
    onCompletedService: new (...args: any) => OnCompletedInterface;
    providers: Provider[];
    imports: (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference<any>)[];
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

#### onCompletedService

- Type: `new (...args: any) => OnCompletedInterface`

This service can be used to perform any additional actions or operations after the upload is completed, such as updating a database record or sending a notification. It implements the [OnCompletedInterface](#oncompletedinterface).

#### providers

- Type: Provider[]
- Default: []

This parameter is used to provide custom providers to the `RCUModule`.

#### imports

- Type: `(Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference<any>)[]`
- Default: []

This parameter is used to import custom modules into the `RCUModule`.

### OnCompletedInterface <Badge type="info" text="interface" />

```ts
export interface OnCompletedInterface {
  handle: (data: { outputFile: string; fileId: string }) => Promise<void>;
}
```

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
