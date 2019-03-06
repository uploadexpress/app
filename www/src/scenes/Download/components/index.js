import React, { Component } from 'react';
import DownloadModal from '../../../components/DownloadModal/components';
import DownloadService from '../../../services/Api/DownloadService';


class Download extends Component {

    state={
        files: [],
        downloadId: null
    }

    constructor() {
        super();
        this.downloadService = new DownloadService();
    }

    onFileDownload = (fileId) => {
        this.downloadService.getFileDownloadUrl(this.state.downloadId, fileId).then((result) => {
       window.location = result.data.url
      })
     }

     onZipDownload = () => {
         return(
            this.props.history.push(`/downloader/${this.state.downloadId}/zip`)
         )
     }

    componentDidMount() {
        let id = this.props.match.params.id;
        this.downloadService.getDownload(id).then((result) => {
            this.setState({
                files: result.data.files,
                downloadId: result.data.id
            })
        })
    }

    render() {


        return(
            <DownloadModal files={this.state.files} onZipDownload={this.onZipDownload} onFileDownload={this.onFileDownload}/>
        )
    }
}

export default Download