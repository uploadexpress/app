import Service from './service';

class UploadService extends Service {
  createUpload = (files, name, gallery, pub) => {
    const resourceUrl = '/uploader/';
    return this.http.post(resourceUrl, {
      files,
      name,
      gallery_only: gallery,
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

  deleteUpload = (uploadId) => {
    const resourceUrl = `/uploader/${uploadId}/`;
    return this.http.delete(resourceUrl);
  }

  putComplete = (uploadId) => {
    const resourceUrl = `/uploader/${uploadId}/complete`;
    return this.http.put(resourceUrl);
  }

  uploadBackground = (uploadId, image) => {
    const resourceUrl = `uploader/${uploadId}/background`;
    return this.http.post(resourceUrl, image);
  }
}


export default UploadService;
