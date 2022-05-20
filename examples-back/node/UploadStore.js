import fs from 'fs'

/**
 * This class manages the identification of the upload and these chunks.
 */

/**
 * @typedef {Object} Upload
 * @property {any} id
 * @property {number} chunkCount
 * @property {number} lastChunk
 * @property {array} chunks
 */

export default class UploadStore {
    /**
     * List of uploads
     * @type {Upload[]}
     */
    rows = []
    
    /**
     * @type {string}
     */
    filePath = ''

    constructor(filePath) {
        this.filePath = filePath

        fs.readFile(this.filePath, (err, buffer) => {
            if (err) {
                console.log(`Failed to read file path ${err.message}`)
                return
            }
            try {
                this.rows = JSON.parse(buffer.toString())
            } catch (e) {
                // JSON invalid
            }
        })
    }

    async getItem(id) {
        return this.rows.find(el => el.id === id)
    }

    async createItem(id, chunkCount) {
        if (this.rows.find(el => el.id === id)) throw `Upload already exist`
        this.rows.push({
            id,
            chunkCount,
            lastChunk: 0,
            chunks: []
        })
        this.persist()
        return this.getItem(id)
    }

    async updateItem(id, update) {
        this.rows = this.rows.map(el => {
            if (el.id === id) return { ...el, ...update }
            return el
        })
        this.persist()
        return this.getItem(id)
    }

    async addChunk(id, chunk) {
        this.rows = this.rows.map(el => {
            if (el.id === id) el.chunk.push(chunk)
            return el
        })
        this.persist()
        return this.getItem(id)
    }

    async removeItem(id) {
        this.rows = this.rows.filter(el => el.id !== id)
        this.persist()
    }

    persist() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.rows))
    }

}