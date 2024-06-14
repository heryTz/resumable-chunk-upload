export type UploadErrorMessage =
'GET_LAST_CHUNK_UPLOADED' |
'UPLOAD_FILE_ERROR' |
'UPLOAD_ABORTED' |
'REQUEST_TIMEOUT' |
'NO_FILE' |
'NO_FILE_ID' |
'NO_UPLOAD_STATUS_URL' |
'NO_UPLOAD_URL'

export interface UploadProgress {
    percent: number
    loaded: number
    remaining: number
}

export type UploadProgressCallback = (
    cb: (info: UploadProgress) => void, 
    throttleTime?: number
) => void