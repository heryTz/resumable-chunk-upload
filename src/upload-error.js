export default class UploadError {
    static GET_LAST_CHUNK_UPLOADED = 'GET_LAST_CHUNK_UPLOADED'
    static UPLOAD_FILE_ERROR = 'UPLOAD_FILE_ERROR'
    static UPLOAD_ABORTED = 'UPLOAD_ABORTED'
    static REQUEST_TIMEOUT = 'REQUEST_TIMEOUT'
    static NO_FILE = 'NO_FILE'
    static NO_FILE_ID = 'NO_FILE_ID'
    static NO_UPLOAD_STATUS_URL = 'NO_UPLOAD_STATUS_URL'
    static NO_UPLOAD_URL = 'NO_UPLOAD_URL'

    constructor(message, data) {
        this.message = message
        this.data = data ?? message
    }

    toString() {
        return this.message
    }
}