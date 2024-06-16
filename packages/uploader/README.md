# Resumable Chunk Upload

[![npm version](https://badge.fury.io/js/resumable-chunk-upload.svg)](https://badge.fury.io/js/resumable-chunk-upload)

Resumable Chunk Upload allows uploading files in small chunks. it offers a *simple class* easy to set up and relevant data such as the *progress* and the *remaining* time of the upload. It also manages the *resumption of the upload* in case of failure.

Resumable Chunk Upload simply focuses on *Javascript clients* so it can be easily integrated into different frameworks frontend. For the back, there are different integrations on the various languages ​​in the [examples-back](https://github.com/heryTz/resumable-chunk-upload/tree/main/examples-back) folder and if you have other implementations, put it in this folder then make a [PR](https://github.com/heryTz/resumable-chunk-upload/pulls).

Resumable chunk upload uses two APIs in its system. When you start the upload, it uses the first API to retrieve the *number of the last uploaded chunk*, then uploads the rest of the *chunks one by one* with the second API until termination. The system sends an *ID* in each request to allow the back to identify the upload.

## Contents

* [Install](#install)
* [Sample usage](#sample-usage)
* [Backend](#backend)
* [Handle error](#handle-error)
* [API](#api)

## Install

Installation via a package manager:

```bash
npm install resumable-chunk-upload
```

Include via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/resumable-chunk-upload/dist/uploader.min.js"></script>
```

## Sample usage

```js
import Uploader, { UploadError } from 'resumable-chunk-upload'

document.querySelector('input').addEventListener('change', e => {
    const file = e.target.files[0]

    (new Uploader())
        .setFile(file)
        .setUploadStatusUrl('http://localhost:9000/uploadStatus')
        .setUploadUrl('http://localhost:9000/upload')
        .onProgress(info => {
            // info.percent: Percentage progress
            // info.loaded: File size already uploaded (byte)
            // info.remaining:  Remaining time (second)
            // 1000: Throttle progress event with 1000 ms
        }, 1000)
        .upload()
            .then(xhr => {
                // success: xhr is a XMLHttpRequest object
            })
            .catch(error => {
                if (error instanceof UploadError) {
                    // This is a custom error to make it easier to manage
                } else {
                    // Other error
                }
            })
})
```

Steps:

* Create an uploader
* Add file
* Add the url to retrieve the number of the last chunk uploaded
* Add the url of the upload
* Start the upload

You can see a more complete example [here](https://github.com/heryTz/resumable-chunk-upload/tree/main/examples-front).

## Backend

For the back, you can find in this [OpenApi](https://github.com/heryTz/resumable-chunk-upload/blob/main/api.yaml) documentation the integration of these two APIs. You can also take inspiration from these [examples](https://github.com/heryTz/resumable-chunk-upload/tree/main/examples-back) that already exist.

## Handle error

```js
// ...
    if (error instanceof UploadError) {
        if (error.message === 'UPLOAD_FILE_ERROR') {
            // Do something
        }
    }
// ...
```

## API

### Uploader

```ts
class Uploader {
    /** 
     * File to upload (required).
     */
    setFile(file: File): this;

    /**
     * Define the url used to retrieve the number of the last uploaded chunk (required).
     */
    setUploadStatusUrl(url: string): this;

    /**
     * Define the url used to upload alls chunks one by one until termination (required).
     */
    setUploadUrl(url: string): this;

    /**
     * Starts the upload and gives the last xhr object of the request on completion. 
     * 
     * This makes it possible to obtain the data returned by the back at the end of the upload 
     * to carry out other processing in case.
     */
    upload(): Promise<XMLHttpRequest>;
    
    /**
     * Change file ID. By default, this value will be the file size + the date of the 
     * last modification.
     */
    setFileId(id: string|number): this;
    
    /**
     * Change chunk size. By default, this value will be 10 Mo.
     * 
     * Note: Do not try to put the size of the pieces too small in production because it may 
     * slow down the upload.
     */
    setChunkSize(size: number): this;
    
    /**
     * Add specific headers like {"Authorization": "Bearer xx-token"}.
     */
    setHeaders(headers: Record<string, string|number>): this;
    
    /**
     * Add a tiemout for each request.
     */
    setRequestTimeout(time: number): this;
    
    /**
     * Listen progress event. It can have a throttle time in the second parameter. 
     * The defaut throttle time is 3000 ms.
     */
    onProgress((info: UploadProgress) => void, throttleTime?: number): this;
    
    /**
     * Abort upload request.
     */
    abort(): void;
}
```

**Note:** The required parameters must be defined before launching the upload.

### UploadProgress

```ts
interface UploadPogress {
    /** Percentage */
    percent: number;

    /** File size already loaded in byte */
    loaded: number;

    /** Remaining time in second */
    remaining: number;
}
```

### UploadError

Errors are identified by constants. These attributes correspond to the value of the message

```ts
class UploadError {
    /**
     * One of the constants.
     */
    message: string;

    /**
     * See below the details.
     */
    data: any;
}
``` 

| Message | Data | Description |
|---------|------|-------------|
| GET_LAST_CHUNK_UPLOADED | XMLHttpRequest | Get last chunk's number error |
| UPLOAD_FILE_ERROR |XMLHttpRequest| Upload file error |
| UPLOAD_ABORTED | XMLHttpRequest | Upload aborted |
| REQUEST_TIMEOUT | XMLHttpRequest | Request timeout |
| NO_FILE | NO_FILE | Missing file parameter |
| NO_FILE_ID | NO_FILE_ID | Missing file ID parameter |
| NO_UPLOAD_STATUS_URL | NO_UPLOAD_STATUS_URL | Missing upload status url parameter |
| NO_UPLOAD_URL | NO_UPLOAD_URL | Missing upload url parameter |
