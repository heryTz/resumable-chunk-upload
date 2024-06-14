import RemainingTime from "./remaning-time"
import { UploadProgress, UploadProgressCallback } from "./types"
import UploadError from "./upload-error"
import { queryParams, throttle, removeTrailingSlash } from './util'

export default class Uploader {
    private file: File|null = null
    private fileId: string|number|null = null
    private chunkNumber: number = 1
    private chunkSize: number = 10485760 // 10Mo
    private chunkCount: number = 1
    private uploadStatusUrl: string|null = null
    private uploadUrl: string|null = null
    private progressThrottleTime: number = 3000 // ms
    private requestTimeout: number|null = null
    private xhr = new XMLHttpRequest()
    private remainingTimeCalculator = new RemainingTime(new Date(), 0)
    private uploadAborted = false
    private headers: Record<string, any> = {}
    private handleProgress: ((info: UploadProgress) => void)|null = null

    private checkParameters = async (): Promise<boolean> => {
        // Mandatory parameters validation
        if (!this.file) throw new UploadError('NO_FILE')
        if (!this.getFileId()) throw new UploadError('NO_FILE_ID')
        if (typeof this.uploadStatusUrl !== 'string') throw new UploadError('NO_UPLOAD_STATUS_URL')
        if (typeof this.uploadUrl !== 'string') throw new UploadError('NO_UPLOAD_URL')
        return true
    }

    private getUploadStatus = async (): Promise<number> => {
        return new Promise((resolve, reject) => {
            this.chunkCount = Math.ceil(this.file!.size / this.chunkSize)
    
            const params = queryParams({
                fileId: this.getFileId(),
                chunkCount: this.chunkCount
            })

            const xhr = new XMLHttpRequest()
            xhr.open('GET', `${this.uploadStatusUrl}?${params}`, true)
            xhr.responseType = 'json'
            if (this.requestTimeout !== null) xhr.timeout = this.requestTimeout

            Object.keys(this.headers).forEach(key => {
                xhr.setRequestHeader(key, this.headers[key])
            })

            xhr.ontimeout = () => {
                reject(new UploadError('REQUEST_TIMEOUT', xhr))
            }

            xhr.onerror = xhr.onabort = () => {
                reject(new UploadError('GET_LAST_CHUNK_UPLOADED', xhr))
            }
            
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response.lastChunk)
                } else {
                    reject(new UploadError('GET_LAST_CHUNK_UPLOADED', xhr))
                }
            }

            xhr.send()
        })
    }

    private uploadFile = async (): Promise<XMLHttpRequest> => {
        return new Promise((resolve, reject) => {
            const xhr = this.xhr
            xhr.open('POST', `${this.uploadUrl}`, true)
            xhr.responseType = 'json'
            if (this.requestTimeout !== null) xhr.timeout = this.requestTimeout

            Object.keys(this.headers).forEach(key => {
                xhr.setRequestHeader(key, this.headers[key])
            })
    
            const form = new FormData()
            form.append('file', this.getChunk())
            form.append('fileId', this.getFileId().toString())
            form.append('chunkCount', this.chunkCount.toString())
            form.append('chunkSize', this.chunkSize.toString())
            form.append('chunkNumber', this.chunkNumber.toString())
            form.append('fileSize', this.file!.size.toString())
            form.append('originalFilename', this.file!.name)
            
            xhr.onload = xhr.onerror = (e) => {
                if (xhr.status === 200) {
                    if (this.chunkNumber < this.chunkCount) {
                        this.chunkNumber++
                        this.uploadFile().then(resolve).catch(reject)
                    } else {
                        resolve(xhr)
                    }
                } else {
                    this.chunkNumber = 1
                    reject(new UploadError('UPLOAD_FILE_ERROR', xhr))
                }
            }
            
            xhr.onabort = (e) => {
                reject(new UploadError('UPLOAD_ABORTED', xhr))
            }

            xhr.ontimeout = () => {
                reject(new UploadError('REQUEST_TIMEOUT', xhr))
            }
            
            xhr.upload.onprogress = throttle((e: ProgressEvent<EventTarget>) => {
                if (this.uploadAborted) return

                const chunkAlreadyUploaded = (this.chunkNumber - 1) * this.chunkSize
                const loaded = chunkAlreadyUploaded + e.loaded
                const total = this.file!.size
                const percent = Math.min(Math.ceil((loaded / total) * 100), 100)

                // After various tests, it was found that the event result of the calculations of the progress and the remaining time give approximate
                // values ​​on the end of the upload. In this case, we decided to manually force the values ​​of the progress and the remaining time 
                // to 100 and 0 respectively.
                const isFinished = this.chunkNumber === this.chunkCount

                this.handleProgress && this.handleProgress({ 
                    percent: isFinished ? 100 : percent, 
                    loaded: isFinished ? this.file!.size : loaded,
                    remaining: isFinished ? 0 : this.remainingTimeCalculator.increaseBytesUploaded(e.loaded).calcul()
                })

            }, this.progressThrottleTime)

            xhr.send(form)
        })
    }
    
    upload = async (): Promise<XMLHttpRequest> => {
        try {
            await this.checkParameters()

            const lastChunk = await this.getUploadStatus()
            this.chunkNumber = lastChunk + 1
            
            // initialize remaining time calcul
            const restByteToUpload = this.file!.slice((this.chunkNumber - 1) * this.chunkSize).size
            this.remainingTimeCalculator = new RemainingTime(new Date(), restByteToUpload)
            
            // Reset some variable
            this.uploadAborted = false

            return await this.uploadFile()
        } catch (e) {
            throw e
        }
    }

    onProgress: UploadProgressCallback = (callback, throttleTime) => {
        this.handleProgress = callback
        if (throttleTime && throttleTime >= 0) this.progressThrottleTime = throttleTime
        return this
    }

    abort = () => {
        this.uploadAborted = true
        this.xhr.abort()
    }

    private getChunk = () => {
        let startSize = (this.chunkNumber - 1) * this.chunkSize
        let endSize = Math.min(startSize + this.chunkSize, this.file!.size)
        return this.file!.slice(startSize, endSize)
    }

    private getFileId = () => {
        const ext = this.file!.name.split('.').pop()
        const defaultId = `${this.file!.size}-${this.file!.lastModified}.${ext}`
        return this.fileId ?? defaultId
    }

    setUploadStatusUrl = (url: string) => {
        this.uploadStatusUrl = removeTrailingSlash(url)
        return this
    }

    setUploadUrl = (url: string) => {
        this.uploadUrl = removeTrailingSlash(url)
        return this
    }

    setFile = (file: File) => {
        this.file = file
        return this
    }

    setChunkSize = (size: number) => {
        this.chunkSize = size
        return this
    }

    setFileId = (id: string|number) => {
        this.fileId = id
        return this
    }

    setHeaders = (headers: Record<string, any>) => {
        this.headers = headers ?? {}
        return this
    }

    setRequestTimeout = (requestTimeout: number) => {
        this.requestTimeout = requestTimeout
        return this
    }

}
