import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';
import DownloadView from '../../../components/DownloadView/components';
import DownloadService from '../../../services/Api/DownloadService';
import { setFiles } from '../../../actions/downloader';
import Background from '../../../components/Background';

class Download extends Component {
  state = {
    error: false,
    loading: true,
  }

  constructor() {
    super();
    this.downloadService = new DownloadService();
  }

  componentDidMount() {
    const { match, setFiles } = this.props;
    const { id } = match.params;
    this.downloadService.getDownload(id).then((result) => {
      setFiles(
        result.data.files,
        result.data.id,
        result.data.backgrounds,
        result.data.gallery,
        result.data.name,
      );
      const currentDate = Date.now();
      const error = currentDate > result.data.expiration_date;
      this.setState({
        loading: false,
        expiration: result.data.expiration_date,
        error,
      });
    }).catch(() => {
      this.setState({
        error: true,
        loading: false,
      });
    });
  }

  onFileDownload = (fileId) => {
    const { downloadId } = this.props;
    this.downloadService.getFileDownloadUrl(downloadId, fileId).then((result) => {
      window.location = result.data.url;
    });
  }

  onZipDownload = () => {
    const { downloadId, files } = this.props;

    if (files.length === 1) { // special case: only one file, no need to create a zip
      this.onFileDownload(files[0].id);
      return;
    }

    window.location = `/v1/downloader/${downloadId}/zip`;
  }

  render() {
    const { error, loading, expiration } = this.state;
    const {
      files, history, downloadId, galleryOnly, uploadName,
    } = this.props;
    return loading
      ? (<div className="spinner d-flex justify-content-center align-items-center"><Spinner /></div>)
      : (
        <Background>
          <DownloadView
            error={error}
            files={files}
            onZipDownload={this.onZipDownload}
            history={history}
            downloadId={downloadId}
            onFileDownload={this.onFileDownload}
            preview
            galleryOnly={galleryOnly}
            uploadName={uploadName}
            expiration={expiration}
          />
        </Background>
      );
  }
}

const mapStateToProps = state => ({
  files: state.downloader.files,
  downloadId: state.downloader.downloadId,
  galleryOnly: state.downloader.galleryOnly,
  uploadName: state.downloader.uploadName,
});

const mapDispatchToProps = dispatch => ({
  setFiles: (
    files, downloadId, backgrounds, uploadName, galleryOnly,
  ) => dispatch(setFiles(files, downloadId, backgrounds, uploadName, galleryOnly)),
});

Download.defaultProps = {
  galleryOnly: false,
  downloadId: '',
  uploadName: '',
};

Download.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node,
    }).isRequired,
  }).isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  history: PropTypes.shape({}).isRequired,
  downloadId: PropTypes.string,
  setFiles: PropTypes.func.isRequired,
  galleryOnly: PropTypes.bool,
  uploadName: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(Download);
