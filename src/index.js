import UploadError from "./upload-error"
import Uploader from "./uploader"

export default Uploader

export { UploadError }

window.Uploader = Uploader
window.UploadError = UploadError