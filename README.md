# Resumable Chunk Upload

[![npm version](https://badge.fury.io/js/resumable-chunk-upload.svg)](https://badge.fury.io/js/resumable-chunk-upload)

Resumable Chunk Upload allows uploading files in small chunks. it offers a *simple class* easy to set up and relevant data such as the *progress* and the *remaining* time of the upload. It also manages the *resumption of the upload* in case of failure.

Resumable Chunk Upload simply focuses on *Javascript clients* so it can be easily integrated into different frameworks frontend. For the back, there are different integrations on the various languages ​​in the [examples-back](https://github.com/heryTz/resumable-chunk-upload/tree/main/examples-back) folder and if you have other implementations, put it in this folder then make a [PR](https://github.com/heryTz/resumable-chunk-upload/pulls).

Resumable chunk upload uses two APIs in its system. When you start the upload, it uses the first API to retrieve the number of the last uploaded chunk, then uploads the rest of the chunks one by one with the second API until termination.

## Install

Start by installing the package:

```bash
npm install resumable-chunk-upload
```

If you are on typescript, add the type definition:

```bash
npm install -D @types/resumable-chunk-upload
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
            // info.loaded: File size already uploaded (octet)
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

## Api

s
