import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';
import DownloadView from '../../../components/DownloadView/components';
import DownloadService from '../../../services/Api/DownloadService';
import { setFiles } from '../actions';

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
      setFiles(result.data.files, result.data.id, result.data.backgrounds);
      this.setState({
        loading: false,
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
    const { downloadId } = this.props;
    window.location = `/v1/downloader/${downloadId}/zip`;
  }

  render() {
    const { error, loading } = this.state;
    const { files, history, downloadId } = this.props;
    return loading
      ? (<div className=" spinner d-flex justify-content-center align-items-center"><Spinner /></div>)
      : (
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
  setFiles: (files, downloadId, backgrounds) => dispatch(setFiles(files, downloadId, backgrounds)),
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
