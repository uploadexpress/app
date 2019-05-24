import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Portal from '../../../../components/Portal/index';
import RequestService from '../../../../services/Api/RequestService';
import DownloadView from '../../../../components/DownloadView/components';
import DownloadService from '../../../../services/Api/DownloadService';

class Requests extends Component {
  constructor() {
    super();
    this.requestService = new RequestService();
    this.downloadService = new DownloadService();
  }

  state = {
    result: [],
    paging: null,
    loading: true,
    expandedRows: [],
    showDownloadWindow: false,
    files: [],
    downloadId: null,
  }

  componentDidMount() {
    this.requestService.getRequestList().then((result) => {
      this.setState({
        ...result.data,
        loading: false,
      });
    });
  }

  handlePageClick = (data) => {
    const selected = data.selected + 1;
    this.requestService.getRequestList(selected).then((result) => {
      this.setState({
        ...result.data,
      });
    });
  }


  newRequest = () => {
    const { history } = this.props;
    history.push('/panel/requests/new');
  }

  deleteRequest = (requestId) => {
    this.requestService.deleteRequest(requestId).then(() => {
      const { result } = this.state;
      const requests = result.filter(request => request.id !== requestId);
      this.setState({
        result: requests,
      });
    });
  }

  handleCopied = (id) => {
    const { result } = this.state;
    this.setState({
      result: result.map(request => ({
        ...request,
        copied: id === request.id,
      })),
    });
  }

  handleExpand = (row) => {
    const { expandedRows } = this.state;
    const newExpandedRows = [...expandedRows];
    const idxFound = newExpandedRows.findIndex(id => id === row.id);

    if (idxFound > -1) {
      newExpandedRows.splice(idxFound, 1);
    } else {
      newExpandedRows.push(row.id);
    }

    this.setState({ expandedRows: [...newExpandedRows] });
  }

  isExpanded = (row) => {
    const { expandedRows } = this.state;
    const idx = expandedRows.findIndex(
      id => id === row.id,
    );

    return idx > -1;
  }

  getRows = (row) => {
    const { t } = this.props;
    const rows = [];
    const firstRow = (
      <tr key={row.id} onClick={() => this.handleExpand(row)}>
        <td>
          {row.uploads.length !== 0
          && (this.isExpanded(row) ? (<FontAwesomeIcon className="request-expand" icon="minus" />) : (<FontAwesomeIcon className="request-expand" icon="plus" />))
          }
        </td>
        <td className="table-body-title">{row.name}</td>
        <td className="table-body-title">{row.description}</td>
        <td className="table-body-title">{row.uploads.length}</td>
        <td className="table-body-title">
          {row.copied ? (
            <div className="upload-copied">{t('upload.linkPreview.copied')}</div>
          ) : (
            <CopyToClipboard text={`${window.hostname}/request/${row.id}`} onCopy={() => { this.handleCopied(row.id); }}>
              <button type="button" className="btn upload-btn-copy">{t('upload.linkPreview.copy')}</button>
            </CopyToClipboard>
          )}
        </td>
        <td className="table-body-title">
          <button
            type="button"
            style={{ color: '#cc0000', fontSize: '14px' }}
            className="btn p-0"
            onClick={() => {
              /* eslint-disable-next-line no-alert */
              if (window.confirm(t('panel.request.deleteConfirmation'))) {
                this.deleteRequest(row.id);
              }
            }}
          >
            {t('panel.request.delete')}
          </button>
        </td>
      </tr>
    );
    rows.push(firstRow);
    if (this.isExpanded(row)) {
      const detailRow = (
        row.uploads.map(upload => (
          <tr>
            <td />
            <td />
            <td className="table-body-title">
              {row.uploads.indexOf(upload) + 1}
            </td>
            <td className="table-body-title">
              {t('panel.request.files', { number: upload.files.length })}
            </td>
            <td className="table-body-title">
              <button type="button" className="btn request-files-watch" onClick={() => { this.showDownloadWindow(upload.files, upload.id); }}>{t('panel.request.showFiles')}</button>
            </td>
            <td />
          </tr>
        ))

      );
      rows.push(detailRow);
    }
    return rows;
  }

  showDownloadWindow = (files, downloadId) => {
    this.setState({
      files,
      downloadId,
      showDownloadWindow: true,
    });
  }

  onFileDownload = (downloadId, fileId) => {
    this.downloadService.getFileDownloadUrl(downloadId, fileId).then((result) => {
      window.location = result.data.url;
    });
  }

  onZipDownload = () => {
    const { downloadId, files } = this.state;

    if (files.length === 1) { // special case: only one file, no need to create a zip
      this.onFileDownload(files[0].id);
      return;
    }

    window.location = `/v1/downloader/${downloadId}/zip`;
  }

  closeDownloadView = () => {
    this.setState({
      showDownloadWindow: false,
    });
  }

  render() {
    const { t, history } = this.props;
    const {
      result, paging, loading, showDownloadWindow, files, downloadId,
    } = this.state;
    return (
      <Portal history={history}>
        <div className="container">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div className="settings-section">{t('panel.request.requests')}</div>
              <div className="upload-list-buttons-container">
                <button type="button" className="btn green-btn mb-3" onClick={this.newRequest}>{t('panel.request.createNew')}</button>
              </div>
            </div>
            <hr className="ordinary-hr" />
          </div>
          <div className="row">
            <div className="col-12">
              <table className="table upload-table">
                <thead>
                  <tr className="table-head">
                    <th className="table-head-title" width={114}>{t('panel.request.info')}</th>
                    <th className="table-head-title" width={156}>{t('panel.request.name')}</th>
                    <th className="table-head-title" width={232}>{t('panel.request.description')}</th>
                    <th className="table-head-title" width={210}>{t('panel.request.uploads')}</th>
                    <th className="table-head-title" width={230}>{t('panel.request.link')}</th>
                    <th className="table-head-title">{t('panel.request.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.map(row => this.getRows(row))}
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
        {showDownloadWindow
          && (
            <div>
              <div className="portal-upload-background" role="presentation" onClick={this.closeDownloadView} />
              <div className="portal-upload">
                <DownloadView
                  files={files}
                  onFileDownload={(fileId) => { this.onFileDownload(downloadId, fileId); }}
                  onZipDownload={this.onZipDownload}
                />
              </div>
            </div>
          )
        }
      </Portal>
    );
  }
}

Requests.propTypes = {
  history: PropTypes.shape({}).isRequired,
  t: PropTypes.func.isRequired,
};

export default (withTranslation()(Requests));
