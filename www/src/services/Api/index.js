import axios from 'axios';

class API {
  constructor({ url }) {
    this.url = url
  }

  createUpload = (files) => {
    let resourceUrl = `${this.url}/uploader/`
    return axios.post(resourceUrl, {
      files: files
    })
  }

  getFileUploadUrl = (uploadId, fileId) => {
    let resourceUrl = `${this.url}/uploader/${uploadId}/file/${fileId}/upload_url`
    return axios.get(resourceUrl)
  }

  getDownload = (downloadId) => {
    let resourceUrl = `${this.url}/downloader/${downloadId}`
    return axios.get(resourceUrl)
  }

  getFileDownloadUrl = (downloadId, fileId) => {
    let resourceUrl = `${this.url}/downloader/${downloadId}/file/${fileId}/download_url`
    return axios.get(resourceUrl)
  }
}

const api = new API({url: process.env.REACT_APP_API_URL})
export default api