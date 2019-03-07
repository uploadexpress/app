import Service from './service';

class UploadService extends Service {
  createUpload = (files, name, pub) => {
    let resourceUrl = "/uploader/"
    return this.http.post(resourceUrl, {
      files: files,
      name: name,
      public: pub,
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

  putComplete = (uploadId) => {
    let resourceUrl = `/uploader/${uploadId}/complete`
    return this.http.put(resourceUrl)
  }
}


export default UploadService