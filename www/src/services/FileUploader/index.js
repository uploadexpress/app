/* eslint-disable no-await-in-loop */
import axios from 'axios';
import UploadService from '../Api/UploadService';

const PART_SIZE = 52428800; // 50mb

async function startUploading(uploadId, file, onUploadProgress) {
  const uploadService = new UploadService();

  // Check file size, if > 50mb
  if (file.fileInput.size > PART_SIZE) {
    // multipart upload
    const res = await uploadService.createMultipartUpload(uploadId, file.id);
    const s3UploadId = res.data.upload_id;
    const uploadedParts = [];

    let start = 0;
    let end = 0;
    let partNum = 1;
    const fileData = file.fileInput;

    while (start < fileData.size) {
      const progress = start;
      end = Math.min(start + PART_SIZE, fileData.size);
      const filePart = fileData.slice(start, end);

      // this is to prevent push blob with 0Kb
      if (filePart.size > 0) {
        const { data: { url } } = (
          await uploadService.createUploadPartRequest(uploadId, file.id, s3UploadId, partNum)
        );

        const res = await axios.put(url, filePart, {
          onUploadProgress: (event) => {
            onUploadProgress({ loaded: progress + event.loaded, total: fileData.size });
          },
        });
        uploadedParts.push({ e_tag: res.headers.etag, part_number: partNum });
      }
      start = PART_SIZE * (partNum);
      partNum += 1;
    }

    await uploadService.completeMultipartRequest(uploadId, file.id, s3UploadId, uploadedParts);
    return file.id;
  }

  // Step 1 -> Fetch file url
  const res = await uploadService.getFileUploadUrl(uploadId, file.id);
  // Step 2 -> upload it
  const { url } = res.data;

  await axios.put(url, file.fileInput, { onUploadProgress });

  return file.id;
}

export default startUploading;
