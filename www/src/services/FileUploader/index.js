import axios from 'axios';
import UploadService from '../Api/UploadService';

const startUploading = (uploadId, file, onUploadProgress) => {
  const uploadService = new UploadService();

  return new Promise((resolve) => {
    // Step 1 -> Fetch file url
    uploadService.getFileUploadUrl(uploadId, file.id).then((res) => {
      // Step 2 -> upload it
      const { url } = res.data;

      axios.put(url, file.fileInput, { onUploadProgress }).then(() => {
        resolve(file.id);
      });
    });
  });
};

export default startUploading;
