export default class UploadError {
    static GET_LAST_CHUNK_UPLOADED = 'GET_LAST_CHUNK_UPLOADED'
    static UPLOAD_FILE_ERROR = 'UPLOAD_FILE_ERROR'
    static UPLOAD_ABORTED = 'UPLOAD_ABORTED'
    static REQUEST_TIMEOUT = 'REQUEST_TIMEOUT'
    static INVALID_CONFIGURATION = 'INVALID_CONFIGURATION'

    constructor(message, data) {
        this.message = message
        this.data = data
    }

    toString() {
        return this.message
    }
}