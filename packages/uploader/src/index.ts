import UploadError from "./upload-error"
import Uploader from "./uploader"

export default Uploader

export { UploadError }

(window as any).Uploader = Uploader;
(window as any).UploadError = UploadError