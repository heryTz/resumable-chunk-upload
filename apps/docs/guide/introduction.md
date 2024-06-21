# Introduction

## Overview

Resumable Chunk Upload allows uploading files in small chunks. it offers a **simple class** easy
to set up and relevant data such as the **progress** and the **remaining time**  of the upload.
It also manages the **resumption of the upload** in case of failure.

## How it work

The Resumable Chunk Upload process is designed for efficient and reliable uploading of large files in chunks, making it particularly suitable for unstable network conditions. Here's a concise overview of the process:

1. **Initialization**: The process begins with the selection of a file, setting it up for upload, and specifying URLs for status checks and chunk uploads.

2. **Retrieving Last Uploaded Chunk**: It checks the last successfully uploaded chunk via the status URL to resume uploads without starting over.

3. **Chunked Upload**: The file is uploaded in customizable chunks (default is 10 MB), sequentially, to manage resources and facilitate easy resumption.

4. **Monitoring Progress**: Provides real-time updates on the upload progress, including the percentage completed and the estimated time remaining.

5. **Completion**: After all chunks are uploaded, a final operation reassembles the file. The server then returns relevant data, such as the file URL.

This streamlined process leverages modern web technologies for a seamless upload experience, perfect for large files and unreliable networks.
