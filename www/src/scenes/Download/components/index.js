import React, { Component } from 'react';
import DownloadView from '../../../components/DownloadView/components';
import DownloadService from '../../../services/Api/DownloadService';
import { connect } from 'react-redux';
import { setFiles } from '../actions'


class Download extends Component {
    constructor() {
        super();
        this.downloadService = new DownloadService();
    }

    onFileDownload = (fileId) => {
        this.downloadService.getFileDownloadUrl(this.props.downloadId, fileId).then((result) => {
        window.location = result.data.url
      })
     }

     onZipDownload = () => {
         return(
            this.props.history.push(`/v1/downloader/${this.props.downloadId}/zip`)
         )
     }

    componentDidMount() {
        let id = this.props.match.params.id;
        this.downloadService.getDownload(id).then((result) => {
            this.props.setFiles(result.data.files, result.data.id)  
        })
    }

    render() {
        return(
            <DownloadView files={this.props.files} onZipDownload={this.onZipDownload} history={this.props.history} downloadId={this.props.downloadId} onFileDownload={this.onFileDownload} preview={true}/>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        files: state.downloader.files,
        downloadId: state.downloader.downloadId
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setFiles: (files, downloadId) => dispatch(setFiles(files, downloadId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Download)