import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs, { writeFileSync } from 'fs'
import UploadStore from './UploadStore.js'

const app = express()
const port = 9000
// Multer manage multipart/form-data request
const upload = multer()

// Data storage manager for uploaded chunk
// The ideal is that these data are persisted so that they are not lost in the event of a server shutdown
const uploadStore = new UploadStore('uploadStore.json')

app.use(cors())
app.use(express.json({
	limit: '50mo'
}))
app.use(express.urlencoded({ extended: true }))

const TMP_PATH = 'tmp/'
const DATA_PATH = 'data/'
// Create directories
fs.mkdirSync(TMP_PATH, { recursive: true })
fs.mkdirSync(DATA_PATH, { recursive: true })

/**
 * @typedef {Object} UploadStatusDto
 * @property {string|number} fileId
 * @property {number} chunkCount
 */
app.get('/uploadStatus', async (req, res) => {
	/**
	 * @type {UploadStatusDto}
	 */
	const query = req.query
	const fileId = query.fileId
	const chunkCount = parseInt(query.chunkCount)
	
	try {
		if (!fileId || !chunkCount) throw 'Invalid parameter'

		const uploadInfo = await uploadStore.getItem(fileId)
		
		if (!uploadInfo) {
			const newUpload = await uploadStore.createItem(fileId, chunkCount)
			// the last chunk is zero if the upload does not yet exist
			return res.json({ lastChunk: newUpload.lastChunk })
		}
		
		// Some validation
		if (uploadInfo && chunkCount !== uploadInfo.chunkCount) {
			await uploadStore.removeItem(fileId)
			const newUpload = await uploadStore.createItem(fileId, chunkCount)
			return res.json({ lastChunk: newUpload.lastChunk })
		}

		return res.json({ lastChunk: uploadInfo.lastChunk })
	} catch (e) {
		return res.status(400).json(e)
	}
})

/**
 * @typedef {Object} UploadDto
 * @property {any} fileId
 * @property {number} chunkNumber
 * @property {string} originalFilename
 * @property {number} chunkCount
 * @property {number} chunkSize
 * @property {number} fileSize
 */
app.post('/upload', upload.single('file'), async (req, res) => {
	/**
	 * You may need this information
	 * @type {UploadDto}
	 */
	const body = req.body
	const fileId = body.fileId
	const chunkNumber = body.chunkNumber
	const originalFilename = body.originalFilename
	const chunkCount = body.chunkCount
	const chunkSize = body.chunkSize
	const fileSize = body.fileSize

	try {
		// Some validation
		if (!fileId) throw 'No file Id'
		
		let uploadInfo = await uploadStore.getItem(fileId)
		if (!uploadInfo) throw 'Invalid upload info'
		
		const chunkId = `${chunkNumber}-${fileId}`
		fs.writeFileSync(`${TMP_PATH}${chunkId}`, req.file.buffer)

		uploadInfo = await uploadStore.updateItem(fileId, {
			chunks: uploadInfo.chunks.concat(chunkId),
			lastChunk: chunkNumber
		})

		// Is finish to upload all chunks ?
		if (uploadInfo.chunkCount > chunkNumber) {
			// You can return the message if you want
			return res.status(200).json({ message: 'Chunk uploaded' })
		}

		// Finish all chunks upload
		const combinedFile = fs.createWriteStream(`${DATA_PATH}${originalFilename}`)

		uploadInfo.chunks.forEach(chunk => {
			let data = fs.readFileSync(`${TMP_PATH}${chunk}`)
			combinedFile.write(data)
			fs.unlink(`${TMP_PATH}${chunk}`, err => err && console.log(err))
		})

		// TODO: validate combined file (eg: by file size)

		combinedFile.end()
		await uploadStore.removeItem(fileId)

		return res.json({ message: 'Upload complete' })
	} catch (e) {
		console.log(e)
		return res.status(400).json(e)
	}
})

app.get('/', (_, res) => {
	res.send('Node backend - Resumable chunk upload')
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})