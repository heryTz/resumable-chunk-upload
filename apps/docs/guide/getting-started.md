# Getting Started

## Installation

Via a package manager:

::: code-group

```bash [npm]
npm install resumable-chunk-upload
```

```bash [yarn]
yarn add resumable-chunk-upload
```

```bash [pnpm]
pnpm add resumable-chunk-upload
```

:::

Include via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/resumable-chunk-upload/dist/uploader.min.js"></script>
```

## Frontend

You can use it with any framework. There are no limits.

::: code-group

```js [app.js]
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
                if (error.message === 'UPLOAD_FILE_ERROR') {
                    // Do something
                }
            } else {
                // Other error
            }
        })
})
```

```html
<!DOCTYPE html>
<html lang="en">
<body>
    <input type="file">
    <script src="https://cdn.jsdelivr.net/npm/resumable-chunk-upload/dist/uploader.min.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

:::

## Backend

You can choose from the existing solutions or create your own integration. You can see the details here [Backend](/guide/backend-overview).

## Full Example

To see a full example of how to use Resumable Chunk Upload, you can check out the [demo repository](https://github.com/heryTz/resumable-chunk-upload/tree/main/examples). It includes both frontend and backend code, along with detailed instructions on how to set it up and run it.
