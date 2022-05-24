// src/upload-error.ts
var UploadError = class {
  constructor(message, data) {
    this.message = message;
    this.data = data ?? message;
  }
  toString() {
    return this.message;
  }
};

// src/remaning-time.ts
var RemainingTime = class {
  constructor(timeStarted, totalSize) {
    this.increaseBytesUploaded = (bytes) => {
      this.uploadedBytes += bytes;
      return this;
    };
    this.calcul = () => {
      let timeElapsed = (Date.now() - this.timeStarted.getTime()) / 1e3;
      let uploadSpeed = this.uploadedBytes / timeElapsed;
      return Math.max(Math.floor((this.totalSize - this.uploadedBytes) / uploadSpeed), 0);
    };
    this.timeStarted = timeStarted;
    this.totalSize = totalSize;
    this.uploadedBytes = 0;
  }
};

// src/util.ts
function removeTrailingSlash(str) {
  return str.replace(/\/+$/, "");
}
function queryParams(query) {
  return Object.keys(query).map((key) => `${key}=${query[key]}`).join("&");
}
var throttlePause = false;
function throttle(callback, time = 0) {
  return (...args) => {
    if (throttlePause)
      return;
    throttlePause = true;
    setTimeout(() => {
      callback.apply(null, args);
      throttlePause = false;
    }, time);
  };
}

// src/uploader.ts
var Uploader = class {
  constructor() {
    this.file = null;
    this.fileId = null;
    this.chunkNumber = 1;
    this.chunkSize = 10485760;
    this.chunkCount = 1;
    this.uploadStatusUrl = null;
    this.uploadUrl = null;
    this.progressThrottleTime = 3e3;
    this.requestTimeout = null;
    this.xhr = new XMLHttpRequest();
    this.remainingTimeCalculator = new RemainingTime(new Date(), 0);
    this.uploadAborted = false;
    this.headers = {};
    this.handleProgress = null;
    this.checkParameters = async () => {
      if (!this.file)
        throw new UploadError("NO_FILE");
      if (!this.getFileId())
        throw new UploadError("NO_FILE_ID");
      if (typeof this.uploadStatusUrl !== "string")
        throw new UploadError("NO_UPLOAD_STATUS_URL");
      if (typeof this.uploadUrl !== "string")
        throw new UploadError("NO_UPLOAD_URL");
      return true;
    };
    this.getUploadStatus = async () => {
      return new Promise((resolve, reject) => {
        this.chunkCount = Math.ceil(this.file.size / this.chunkSize);
        const params = queryParams({
          fileId: this.getFileId(),
          chunkCount: this.chunkCount
        });
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${this.uploadStatusUrl}?${params}`, true);
        xhr.responseType = "json";
        if (this.requestTimeout !== null)
          xhr.timeout = this.requestTimeout;
        Object.keys(this.headers).forEach((key) => {
          xhr.setRequestHeader(key, this.headers[key]);
        });
        xhr.ontimeout = () => {
          reject(new UploadError("REQUEST_TIMEOUT", xhr));
        };
        xhr.onerror = xhr.onabort = () => {
          reject(new UploadError("GET_LAST_CHUNK_UPLOADED", xhr));
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response.lastChunk);
          } else {
            reject(new UploadError("GET_LAST_CHUNK_UPLOADED", xhr));
          }
        };
        xhr.send();
      });
    };
    this.uploadFile = async () => {
      return new Promise((resolve, reject) => {
        const xhr = this.xhr;
        xhr.open("POST", `${this.uploadUrl}`, true);
        xhr.responseType = "json";
        if (this.requestTimeout !== null)
          xhr.timeout = this.requestTimeout;
        Object.keys(this.headers).forEach((key) => {
          xhr.setRequestHeader(key, this.headers[key]);
        });
        const form = new FormData();
        form.append("file", this.getChunk());
        form.append("fileId", this.getFileId().toString());
        form.append("chunkCount", this.chunkCount.toString());
        form.append("chunkSize", this.chunkSize.toString());
        form.append("chunkNumber", this.chunkNumber.toString());
        form.append("fileSize", this.file.size.toString());
        form.append("originalFilename", this.file.name);
        xhr.onload = xhr.onerror = (e) => {
          if (xhr.status === 200) {
            if (this.chunkNumber < this.chunkCount) {
              this.chunkNumber++;
              this.uploadFile().then(resolve).catch(reject);
            } else {
              resolve(xhr);
            }
          } else {
            this.chunkNumber = 1;
            reject(new UploadError("UPLOAD_FILE_ERROR", xhr));
          }
        };
        xhr.onabort = (e) => {
          reject(new UploadError("UPLOAD_ABORTED", xhr));
        };
        xhr.ontimeout = () => {
          reject(new UploadError("REQUEST_TIMEOUT", xhr));
        };
        xhr.upload.onprogress = throttle((e) => {
          if (this.uploadAborted)
            return;
          const chunkAlreadyUploaded = (this.chunkNumber - 1) * this.chunkSize;
          const loaded = chunkAlreadyUploaded + e.loaded;
          const total = this.file.size;
          const percent = Math.min(Math.ceil(loaded / total * 100), 100);
          const isFinished = this.chunkNumber === this.chunkCount;
          this.handleProgress && this.handleProgress({
            percent: isFinished ? 100 : percent,
            loaded: isFinished ? this.file.size : loaded,
            remaining: isFinished ? 0 : this.remainingTimeCalculator.increaseBytesUploaded(e.loaded).calcul()
          });
        }, this.progressThrottleTime);
        xhr.send(form);
      });
    };
    this.upload = async () => {
      try {
        await this.checkParameters();
        const lastChunk = await this.getUploadStatus();
        this.chunkNumber = lastChunk + 1;
        const restByteToUpload = this.file.slice((this.chunkNumber - 1) * this.chunkSize).size;
        this.remainingTimeCalculator = new RemainingTime(new Date(), restByteToUpload);
        this.uploadAborted = false;
        return await this.uploadFile();
      } catch (e) {
        throw e;
      }
    };
    this.onProgress = (callback, throttleTime) => {
      this.handleProgress = callback;
      if (throttleTime && throttleTime >= 0)
        this.progressThrottleTime = throttleTime;
      return this;
    };
    this.abort = () => {
      this.uploadAborted = true;
      this.xhr.abort();
    };
    this.getChunk = () => {
      let startSize = (this.chunkNumber - 1) * this.chunkSize;
      let endSize = Math.min(startSize + this.chunkSize, this.file.size);
      return this.file.slice(startSize, endSize);
    };
    this.getFileId = () => {
      const ext = this.file.name.split(".").pop();
      const defaultId = `${this.file.size}-${this.file.lastModified}.${ext}`;
      return this.fileId ?? defaultId;
    };
    this.setUploadStatusUrl = (url) => {
      this.uploadStatusUrl = removeTrailingSlash(url);
      return this;
    };
    this.setUploadUrl = (url) => {
      this.uploadUrl = removeTrailingSlash(url);
      return this;
    };
    this.setFile = (file) => {
      this.file = file;
      return this;
    };
    this.setChunkSize = (size) => {
      this.chunkSize = size;
      return this;
    };
    this.setFileId = (id) => {
      this.fileId = id;
      return this;
    };
    this.setHeaders = (headers) => {
      this.headers = headers ?? {};
      return this;
    };
    this.setRequestTimeout = (requestTimeout) => {
      this.requestTimeout = requestTimeout;
      return this;
    };
  }
};

// src/index.ts
var src_default = Uploader;
window.Uploader = Uploader;
window.UploadError = UploadError;
export {
  UploadError,
  src_default as default
};
