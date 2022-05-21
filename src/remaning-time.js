export default class RemainingTime {

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