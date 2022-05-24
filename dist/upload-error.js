export default class UploadError {
    message;
    data;
    constructor(message, data) {
        this.message = message;
        this.data = data ?? message;
    }
    toString() {
        return this.message;
    }
}
