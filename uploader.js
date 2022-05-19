
export default class Uploader {
    baseUrl = null
    file = null
    fileId = ''
    chunkNumber = 1
    chunkSize = 10485760 // 10Mo
    chunkCount = 1
    lastChunkUploadedPath = '/lastChunkUploaded'
    uploadPath = '/upload'
    progressTimeout = 3000 // ms
    xhr = new XMLHttpRequest()
    remainingTimeCalculator = new RemainingTimeCalculator(new Date(), 0)
    uploadAborted = false

    onProgress = () => {}

    getLastChunkUploaded = async () => {
        return new Promise((resolve, reject) => {
            this.chunkCount = Math.ceil(this.file.size / this.chunkSize)
    
            const params = queryParams({
                fileId: this.getFileId(),
                chunkCount: this.chunkCount
            })
    
            const xhr = new XMLHttpRequest()
            xhr.open('GET', `${this.baseUrl}${this.lastChunkUploadedPath}?${params}`, true)
            xhr.responseType = 'json'

            xhr.onerror = xhr.onabort = () => {
                reject(new UploadError(UploadError.GET_LAST_CHUNK_UPLOADED, xhr))
            }
            
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response.lastChunk)
                } else {
                    reject(new UploadError(UploadError.GET_LAST_CHUNK_UPLOADED, xhr))
                }
            }

            xhr.send()
        })
    }

    uploadFile = async () => {
        return new Promise((resolve, reject) => {
            const xhr = this.xhr
            xhr.open('POST', `${this.baseUrl}${this.uploadPath}`, true)
            xhr.responseType = 'json'
    
            const form = new FormData()
            form.append('file', this.getChunk())
            form.append('fileId', this.getFileId())
            form.append('chunkCount', this.chunkCount)
            form.append('chunkSize', this.chunkSize)
            form.append('chunkNumber', this.chunkNumber)
            form.append('fileSize', this.file.size)
            form.append('originalFilename', this.file.name)
            
            xhr.onload = xhr.onerror = (e) => {
                if (xhr.status === 200) {
                    this.chunkNumber++
                    if (this.chunkNumber <= this.chunkCount) {
                        this.uploadFile()
                    } else {
                        resolve(xhr)
                    }
                } else {
                    this.chunkNumber = 1
                    reject(new UploadError(UploadError.UPLOAD_FILE_ERROR, xhr))
                }
            }
            
            xhr.onabort = (e) => {
                this.chunkNumber = 1
                reject(new UploadError(UploadError.UPLOAD_ABORTED, xhr))
            }
            
            xhr.upload.onprogress = throttle(e => {
                if (this.uploadAborted) return

                const chunkAlreadyUploaded = (this.chunkNumber - 1) * this.chunkSize
                const loaded = chunkAlreadyUploaded + e.loaded
                const total = this.file.size
                const percent = Math.min(Math.ceil((loaded / total) * 100), 100)
                this.onProgress && this.onProgress({ 
                    percent, 
                    loaded,
                    remaining: this.remainingTimeCalculator.increaseBytesUploaded(e.loaded).calcul(this.chunkLoaded)
                })
            }, this.progressTimeout)

            xhr.send(form)
        })
    }
    
    upload = async () => {
        try {
            const lastChunk = await this.getLastChunkUploaded()
            this.chunkNumber = lastChunk + 1
            
            // initialize remaining time calcul
            const restByteToUpload = this.file.slice((this.chunkNumber - 1) * this.chunkSize).size
            this.remainingTimeCalculator = new RemainingTimeCalculator(new Date(), restByteToUpload)
            
            // Reset some variable
            this.uploadAborted = false

            return await this.uploadFile()
        } catch (e) {
            throw e
        }
    }

    onProgress = (callback, debounceTime) => {
        this.onProgress = callback
        if (debounceTime >= 0) this.progressTimeout = parseInt(debounceTime)
        return this
    }

    abort = () => {
        this.uploadAborted = true
        this.xhr.abort()
    }

    getChunk = () => {
        let startSize = (this.chunkNumber - 1) * this.chunkSize
        let endSize = Math.min(startSize + this.chunkSize, this.file.size)
        return this.file.slice(startSize, endSize)
    }

    getFileId = () => {
        const ext = this.file.name.split('.').pop()
        const defaultId = `${this.file.size}-${this.file.lastModified}.${ext}`
        return this.fileId || defaultId
    }

    setBaseUrl = (url) => {
        this.baseUrl = removeTrailingSlash(url)
        return this
    }

    setFile = (file) => {
        this.file = file
        return this
    }

    setChunkSize = (size) => {
        this.chunkSize = parseInt(size)
        return this
    }

    setFileId = (id) => {
        this.fileId = id
        return this
    }

}

class RemainingTimeCalculator {

    constructor(timeStarted, totalSize) {
        this.timeStarted = timeStarted
        this.totalSize = totalSize
        this.uploadedBytes = 0
    }

    increaseBytesUploaded = (bytes) => {
        this.uploadedBytes += bytes
        return this
    }

    calcul = () => {
        let timeElapsed = (Date.now() - this.timeStarted.getTime()) / 1000 // (s)
        let uploadSpeed = this.uploadedBytes / timeElapsed
        return Math.max(Math.floor((this.totalSize - this.uploadedBytes) / uploadSpeed), 0)
    }
} 

class UploadError {
    static GET_LAST_CHUNK_UPLOADED = 'GET_LAST_CHUNK_UPLOADED'
    static UPLOAD_FILE_ERROR = 'UPLOAD_FILE_ERROR'
    static UPLOAD_ABORTED = 'UPLOAD_ABORTED'

    constructor(message, data) {
        this.message = message
        this.data = data
    }

}

const removeTrailingSlash = str => str.replace(/\/+$/, '')

const queryParams = (query) => Object.keys(query).map(key => `${key}=${query[key]}`).join('&')

let throttlePause = false
const throttle = (callback, time = 0) => {
    return (...args) => {
        if (throttlePause) return
        throttlePause = true
        setTimeout(() => {
            callback.apply(null, args)
            throttlePause = false
        }, time)
    }
}

window.Uploader = Uploader
window.UploadError = UploadError