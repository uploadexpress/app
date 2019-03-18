import Service from './service';

class UploadService extends Service {
  createUpload = (files, name, pub) => {
    const resourceUrl = '/uploader/';
    return this.http.post(resourceUrl, {
      files,
      name,
      public: pub,
    });
  }

  getFileUploadUrl = (uploadId, fileId) => {
    const resourceUrl = `/uploader/${uploadId}/file/${fileId}/upload_url`;
    return this.http.get(resourceUrl);
  }

  getUploadList = (page) => {
    const resourceUrl = '/uploader/';
    return this.http.get(resourceUrl, {
      params: { current_page: page },
    });
  }

  putComplete = (uploadId) => {
    const resourceUrl = `/uploader/${uploadId}/complete`;
    return this.http.put(resourceUrl);
  }
}


export default UploadService;
