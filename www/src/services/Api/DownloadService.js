import Service from './service'

class DownloadService extends Service {
    getDownload = (downloadId) => {
        let resourceUrl = `/downloader/${downloadId}`
        return this.http.get(resourceUrl)
    }

    getFileDownloadUrl = (downloadId, fileId) => {
        let resourceUrl = `/downloader/${downloadId}/file/${fileId}/download_url`
        return this.http.get(resourceUrl)
    }
}

export default DownloadService