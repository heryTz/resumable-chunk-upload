# Frontend API

## Uploader <Badge type="info" text="class" />

The `Uploader` class is a type that represents a file uploader. It provides various methods to manage the upload process.

```ts
class Uploader {
  setFile(file: File): this;
  setUploadStatusUrl(url: string): this;
  setUploadUrl(url: string): this;
  setFileId(id: string|number): this;
  setChunkSize(size: number): this;
  setHeaders(headers: Record<string, string|number>): this;
  setRequestTimeout(time: number): this;
  onProgress((info: UploadProgress) => void, throttleTime?: number): this;
  upload(): Promise<XMLHttpRequest>;
  abort(): void;
}
```

### setFile

- Type: `(file: File) => Uploader`
- Required: `true`

Set file to upload

### setUploadStatusUrl

- Type: `(url: string) => Uploader`
- Required: `true`

Define the url used to retrieve the number of the last uploaded chunk

### setUploadUrl

- Type: `(url: string) => Uploader`
- Required: `true`

Define the url used to upload alls chunks one by one until termination

### setFileId

- Type: `(id: string) => Uploader`
- Required: `false`

Change file ID. By default, this value will be the file size + the date of the last modification.

### setChunkSize

- Type: `(size: number) => Uploader`
- Required: `false`

Change chunk size. By default, this value will be **10 Mo**.

::: warning
Do not try to put the size of the pieces too small in production because it may slow down the upload.
:::

### setHeaders

- Type: `(headers: Record<string, string|number>) => Uploader`
- Required: `false`

Add specific headers like {"Authorization": "Bearer xxx"}.

### setRequestTimeout

- Type: `(timer: number) => Uploader`
- Required: `false`

Add a tiemout for each request.

### onProgress

- Type: `((info: UploadProgress, throttleTime?: number) => void) => Uploader`
- Required: `false`

Listen progress event. It can have a throttle time in the second parameter. The defaut throttle time is **3000 ms**.

You can find the type definition for [UploadProgress](#uploadprogress) below.

### upload

- Type: `() => Promise<XMLHttpRequest>`
- Required: `false`

Starts the upload and returns the last XMLHttpRequest object upon completion.

This allows you to retrieve the data returned by the backend at the end of the upload and perform additional processing if needed.

### abort

- Type: `() => void`
- Required: `false`

Abort the ongoing upload process.

## UploadProgress <Badge type="info" text="interface" />

This interface represents the information provided by the [onProgress](#onprogress) method.

```ts
interface UploadPogress {
  percent: number;
  loaded: number;
  remaining: number;
}
```

### percent

- Type: `number`

Represents the percentage of completion for a task or process. It is a numeric value between 0 and 100.

### loaded

- Type: `number`

Represents the size of the file that has already been loaded, measured in bytes.

### remaining

- Type: `number`

Represents the remaining time in seconds for the upload process to complete.

## UploadError <Badge type="info" text="class" />

Represents an error that can occur during the upload process.

```ts
class UploadError {
  message: string;
  data: any;
}
```

### message

- Type: `string`

The error message.

### data

- Type: `any`

Additional data related to the error.

Here are the possible error messages:

| Message | Data | Description |
|---------|------|-------------|
| GET_LAST_CHUNK_UPLOADED | XMLHttpRequest | Error occurred while trying to get the number of the last uploaded chunk. |
| UPLOAD_FILE_ERROR |XMLHttpRequest| Error occurred while uploading the file. |
| UPLOAD_ABORTED | XMLHttpRequest | The upload process was aborted. |
| REQUEST_TIMEOUT | XMLHttpRequest | The request timed out. |
| NO_FILE | NO_FILE | Missing file parameter. |
| NO_FILE_ID | NO_FILE_ID | Missing file ID parameter. |
| NO_UPLOAD_STATUS_URL | NO_UPLOAD_STATUS_URL | Missing upload status URL parameter. |
| NO_UPLOAD_URL | NO_UPLOAD_URL | Missing upload URL parameter. |
