import Service from './service';

class UploadService extends Service {
  createUpload = (files, name) => {
    let resourceUrl = "/uploader/"
    return this.http.post(resourceUrl, {
      files: files,
      name: name
    })
  }

  getFileUploadUrl = (uploadId, fileId) => {
    let resourceUrl = `/uploader/${uploadId}/file/${fileId}/upload_url`
    return this.http.get(resourceUrl)
  }

  getUploadList = (page) => {
    let resourceUrl = "/uploader/"
    return this.http.get(resourceUrl, {
      params: {current_page: page}
    })
  }
}

export default UploadService