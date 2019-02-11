import api from "../Api";
import axios from "axios";

const startUploading = (uploadId, file, onUploadProgress) => {
  return new Promise((resolve, reject) => {
    // Step 1 -> Fetch file url
    api.getFileUploadUrl(uploadId, file.id).then((res) => {
      // Step 2 -> upload it
      const url = res.data.url

      axios.put(url, file.fileInput, { onUploadProgress: onUploadProgress }).then((result) => {
        resolve(file.id);
      })
    })
  });
}
export default startUploading