import Service from './service';

class DownloadService extends Service {
    getDownload = (downloadId) => {
      const resourceUrl = `/downloader/${downloadId}`;
      return this.http.get(resourceUrl);
    }

    getFileDownloadUrl = (downloadId, fileId) => {
      const resourceUrl = `/downloader/${downloadId}/file/${fileId}/download_url`;
      return this.http.get(resourceUrl);
    }
}

export default DownloadService;
