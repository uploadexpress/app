import React, { Component } from 'react'
import '../../style/index.css';
import { withTranslation } from 'react-i18next';
import Portal from '../../index'
import UploadService from '../../../../services/Api/UploadService'
import UploadModal from '../../../../components/UploadModal/components'
import '../style/index.css'
import { connect } from 'react-redux'
import { resetUpload } from '../../../../components/UploadModal/actions'
import ReactPaginate from 'react-paginate';
import { CopyToClipboard } from 'react-copy-to-clipboard';

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
                loading: false
            })
        })
    }

    handleClick = () => {
        this.setState({
            uploadModal: !this.state.uploadModal,
        })
        this.props.resetUpload()
    }

    handlePageClick = data => {
        let selected = data.selected + 1;
        this.uploadService.getUploadList(selected).then((result) => {
            this.setState({
                ...result.data,
                loading: false
            })
        })
    }

    handleCopied = (id) => {
        this.setState({
            result: this.state.result.map(file => {
                file.copied = id === file.id
                return file
            })
        })
    }

    render() {
        const { t } = this.props;
        return (
            <Portal history={this.props.history}>

                <div className="container">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-between align-items-center">
                            <div className="settings-section">{t('panel.uploadList.title')}</div>
                            <button className="btn green-btn mb-3" onClick={this.handleClick}>{t('panel.uploadList.uploadFile')}</button>
                        </div>
                        <hr className='ordinary-hr' />
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <table className="table upload-table">
                                <thead >
                                    <tr className="table-head" >
                                        <th className="table-head-title">{t('panel.uploadList.name')}</th>
                                        <th className="table-head-title">{t('panel.uploadList.link')}</th>
                                        <th className="table-head-title">{t('panel.uploadList.files')}</th>
                                        <th className="table-head-title">{t('panel.uploadList.downloads')}</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {this.state.result.map(row => {
                                        return (
                                            <tr>
                                                <td className="table-body-title">{row.name}</td>
                                                <td className="table-body-title">

                                                    {row.copied ? (
                                                        <div className="upload-copied">Copied!</div>
                                                    ) : (
                                                            <CopyToClipboard text={'https://upload.express/download/' + row.id} onCopy={() => { this.handleCopied(row.id) }}>
                                                                <button className="btn upload-btn-copy">Copy</button>
                                                            </CopyToClipboard>
                                                        )}
                                                </td>
                                                <td className="table-body-title">{row.files.length}</td>
                                                <td className="table-body-title">{row.download_count}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {!this.state.loading &&
                                <div className="text-center">
                                    <ReactPaginate
                                        previousLabel={'previous'}
                                        nextLabel={'next'}
                                        breakLabel={'...'}
                                        pageCount={this.state.paging.total}
                                        onPageChange={this.handlePageClick}
                                        containerClassName={'pagination'}
                                        subContainerClassName={'pages pagination'}
                                        activeClassName={'active'}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {this.state.uploadModal &&
                    <div>
                        <div className='portal-upload-background' onClick={this.handleClick}></div>
                        <div className='portal-upload'>
                            <UploadModal shouldDisplayName={true} />
                        </div>
                    </div>
                }
            </Portal>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetUpload: () => dispatch(resetUpload())
    }
}

export default connect(null, mapDispatchToProps)(withTranslation()(UploadList))