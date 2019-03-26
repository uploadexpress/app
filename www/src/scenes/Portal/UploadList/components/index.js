import React, { Component } from 'react';
import '../../style/index.css';
import { withTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactPaginate from 'react-paginate';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Portal from '../../index';
import UploadService from '../../../../services/Api/UploadService';
import UploadModal from '../../../../components/UploadModal/components';
import { resetUpload } from '../../../../components/UploadModal/actions';
import '../style/index.css';

class UploadList extends Component {
  constructor() {
    super();
    this.uploadService = new UploadService();
  }

  state = {
    result: [],
    paging: null,
    uploadModal: false,
    loading: true,
  }

  componentDidMount() {
    this.uploadService.getUploadList().then((result) => {
      this.setState({
        ...result.data,
        loading: false,
      });
    });
  }

  onKeyDown = (event) => {
    if (event.keyCode === 27) { // escape key
      this.handleClick();
    }
  }

  handleClick = () => {
    const { uploadModal } = this.state;
    const { resetUpload } = this.props;

    this.setState({
      uploadModal: !uploadModal,
    });
    resetUpload();
  }

  handlePageClick = (data) => {
    const selected = data.selected + 1;
    this.uploadService.getUploadList(selected).then((result) => {
      this.setState({
        ...result.data,
        loading: false,
      });
    });
  }

  handleCopied = (id) => {
    const { result } = this.state;
    this.setState({
      result: result.map(file => ({
        ...file,
        copied: id === file.id,
      })),
    });
  }

  deleteUpload = (uploadId) => {
    this.uploadService.deleteUpload(uploadId).then(() => {
      const { result } = this.state;
      const files = result.filter(file => file.id !== uploadId);
      this.setState({
        result: files,
      });
    });
  }

  render() {
    const { t, history } = this.props;
    const {
      result, paging, uploadModal, loading,
    } = this.state;
    return (
      <Portal history={history}>
        <div className="container">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div className="settings-section">{t('panel.uploadList.title')}</div>
              <button type="button" className="btn green-btn mb-3" onClick={this.handleClick}>{t('panel.uploadList.uploadFile')}</button>
            </div>
            <hr className="ordinary-hr" />
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-12">
              <table className="table upload-table">
                <thead>
                  <tr className="table-head">
                    <th className="table-head-title">{t('panel.uploadList.name')}</th>
                    <th className="table-head-title">{t('panel.uploadList.link')}</th>
                    <th className="table-head-title">{t('panel.uploadList.files')}</th>
                    <th className="table-head-title">{t('panel.uploadList.downloads')}</th>
                    <th className="table-head-title">Actions</th>
                  </tr>
                </thead>
                <tbody>

                  {result.map(row => (
                    <tr>
                      <td className="table-body-title">{row.name}</td>
                      <td className="table-body-title">

                        {row.copied ? (
                          <div className="upload-copied">{t('upload.linkPreview.copied')}</div>
                        ) : (
                          <CopyToClipboard text={`${window.hostname}/download/${row.id}`} onCopy={() => { this.handleCopied(row.id); }}>
                            <button type="button" className="btn upload-btn-copy">{t('upload.linkPreview.copy')}</button>
                          </CopyToClipboard>
                        )}
                      </td>
                      <td className="table-body-title">{row.files.length}</td>
                      <td className="table-body-title">{row.download_count}</td>
                      <td className="table-body-title">
                        <button type="button" style={{ color: '#cc0000', fontSize: '14px' }} className="btn p-0" onClick={() => { this.deleteUpload(row.id); }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading
                && (
                  <div className="text-center">
                    <ReactPaginate
                      previousLabel={t('panel.uploadList.previous')}
                      nextLabel={t('panel.uploadList.next')}
                      breakLabel="..."
                      pageCount={paging.total}
                      onPageChange={this.handlePageClick}
                      containerClassName="pagination"
                      subContainerClassName="pages pagination"
                      activeClassName="active"
                    />
                  </div>
                )
              }
            </div>
          </div>
        </div>
        {uploadModal
          && (
            <div>
              <div className="portal-upload-background" role="presentation" onKeyDown={this.handleClick} onClick={this.handleClick} />
              <div className="portal-upload">
                <UploadModal publicUpload={false} shouldDisplayName />
              </div>
            </div>
          )
        }
      </Portal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  resetUpload: () => dispatch(resetUpload()),
});

UploadList.propTypes = {
  resetUpload: PropTypes.func.isRequired,
};

UploadList.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default connect(null, mapDispatchToProps)(withTranslation()(UploadList));
