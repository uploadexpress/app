import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DownloadView from '../../../components/DownloadView/components';
import DownloadService from '../../../services/Api/DownloadService';
import { setFiles } from '../actions';

class Download extends Component {
  state = {
    error: false,
  }

  constructor() {
    super();
    this.downloadService = new DownloadService();
  }

  componentDidMount() {
    const { match, setFiles } = this.props;
    const { id } = match.params;
    this.downloadService.getDownload(id).then((result) => {
      setFiles(result.data.files, result.data.id);
    }).catch(() => {
      this.setState({
        error: true,
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
    const { downloadId } = this.props;
    window.location = `/v1/downloader/${downloadId}/zip`;
  }

  render() {
    const { error } = this.state;
    const { files, history, downloadId } = this.props;
    return (
      <DownloadView
        error={error}
        files={files}
        onZipDownload={this.onZipDownload}
        history={history}
        downloadId={downloadId}
        onFileDownload={this.onFileDownload}
        preview
      />
    );
  }
}

const mapStateToProps = state => ({
  files: state.downloader.files,
  downloadId: state.downloader.downloadId,
});

const mapDispatchToProps = dispatch => ({
  setFiles: (files, downloadId) => dispatch(setFiles(files, downloadId)),
});

Download.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node,
    }).isRequired,
  }).isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  history: PropTypes.shape({}).isRequired,
  downloadId: PropTypes.string.isRequired,
  setFiles: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Download);
