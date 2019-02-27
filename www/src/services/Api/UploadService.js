import Service from './service';

class UploadService extends Service {
  createUpload = (files) => {
    let resourceUrl = "/uploader/"
    return this.http.post(resourceUrl, {
      files: files
    })
  }

  getFileUploadUrl = (uploadId, fileId) => {
    let resourceUrl = `/uploader/${uploadId}/file/${fileId}/upload_url`
    return this.http.get(resourceUrl)
  }

  getUploadList = () => {
    let resourceUrl = "/uploader/"
    return this.http.get(resourceUrl)
  }
}

export default UploadService