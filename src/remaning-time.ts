export default class RemainingTime {
    private timeStarted: Date
    private totalSize: number
    private uploadedBytes: number

    constructor(timeStarted: Date, totalSize: number) {
        this.timeStarted = timeStarted
        this.totalSize = totalSize
        this.uploadedBytes = 0
    }

    increaseBytesUploaded = (bytes: number) => {
        this.uploadedBytes += bytes
        return this
    }

    calcul = () => {
        let timeElapsed = (Date.now() - this.timeStarted.getTime()) / 1000 // (s)
        let uploadSpeed = this.uploadedBytes / timeElapsed
        return Math.max(Math.floor((this.totalSize - this.uploadedBytes) / uploadSpeed), 0)
    }
} 