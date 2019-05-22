import Service from './service';

class UploadService extends Service {
  createUpload = (files, name, gallery, pub, requestId) => {
    const resourceUrl = '/uploader/';
    return this.http.post(resourceUrl, {
      files,
      name,
      gallery,
      public: pub,
      request_id: requestId,
    });
  }

  uploadFile = (uploadId, fileId, fileData, onUploadProgress) => {
    const resourceUrl = `/uploader/${uploadId}/file/${fileId}/upload`;
    return this.http.put(resourceUrl, fileData, { onUploadProgress });
  }

  uploadPart = (uploadId, fileId, s3UploadId, partNumber, fileData, onUploadProgress) => {
    const resourceUrl = `/uploader/${uploadId}/file/${fileId}/upload/${s3UploadId}/part/${partNumber}`;
    return this.http.put(resourceUrl, fileData, { onUploadProgress });
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

  sendEmail = (uploadId, recipientEmails, senderEmail, message, language) => {
    const resourceUrl = `uploader/${uploadId}/mail`;
    return this.http.post(resourceUrl, {
      recipient_emails: recipientEmails,
      sender_email: senderEmail,
      message,
      language,
    });
  }

  createMultipartUpload = (uploadId, fileId) => {
    const resourceUrl = `/uploader/${uploadId}/file/${fileId}/create_multipart`;
    return this.http.get(resourceUrl);
  }

  createUploadPartRequest = (uploadId, fileId, s3UploadId, partNumber) => {
    const resourceUrl = `/uploader/${uploadId}/file/${fileId}/part_url/${s3UploadId}/part/${partNumber}`;
    return this.http.get(resourceUrl);
  }

  completeMultipartRequest = (uploadId, fileId, s3UploadId, uploadedParts) => {
    const resourceUrl = `/uploader/${uploadId}/file/${fileId}/complete_multipart/${s3UploadId}`;
    return this.http.post(resourceUrl, { parts: uploadedParts });
  }
}


export default UploadService;
