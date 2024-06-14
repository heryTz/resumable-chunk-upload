import { UploadErrorMessage } from "./types"

export default class UploadError<T extends unknown> {
    message: string
    data: unknown

    constructor(message: UploadErrorMessage, data?: T) {
        this.message = message
        this.data = data ?? message
    }

    toString() {
        return this.message
    }
}