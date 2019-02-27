import React, { Component } from 'react';
import File from './File';
import UploadService from '../../../services/Api/UploadService'
import uploadFile from '../../../services/FileUploader'
import { promiseSerial } from '../../../helpers/promiseSerial';
import { updateProgress, startUploading, endUploading } from '../actions';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UploaderStatus } from '../constants';
import stringTruncate from '../../../helpers/stringTruncate'

class Listfiles extends Component {
    state = {
        uploadId: null,
        filesToUpload: [],
        isButtonDisabled: false,
    }

    constructor(){
        super();
        this.uploadService = new UploadService();
    }
    
    onUploadProgress = (fileId, progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        this.props.updateProgress(fileId, percentCompleted);
    }

    onDrop = (acceptedFiles) => {
        this.props.onFilesSelected(acceptedFiles);
    }

    beginUpload = (data) => {
        // Returns the ID to the main component
        this.props.onUploadCreated(data.id);

        const uploadPromises = this.props.files.map((file) => {
            return () => {
                return uploadFile(data.id, file, (event) => {
                    this.onUploadProgress(file.id, event)
                })
            }
        })

        promiseSerial(uploadPromises).then(() => {
            this.props.endUploading();
        })
    }

    createFiles = () => {
        this.props.startUploading();
        let files = this.props.files.map(file => {
            return {
                'id': file.id,
                'name': file.fileInput.name,
                'size': file.fileInput.size
            }

        })

        this.uploadService.createUpload(files).then(res => {
            this.beginUpload(res.data);
        })

        this.setState({
            isButtonDisabled: true
        });
    }

    renderFiles() {
        return this.props.files.map(file => {
            return (
                <File
                    key={file.id}
                    name={stringTruncate(file.fileInput.name, 25)}
                    progress={file.progress}
                    status={file.status}
                    id={file.id}
                />
            )
        })
    }

    render() {
        const { t } = this.props;

        return (
            <div className="listfiles">
                <div className="list-title">{t('upload.listFile.title')}</div>
                <hr />
                <div className='list-container'>
                    <Dropzone
                        onDrop={this.onDrop}
                        disableClick={true}
                        disabled={this.props.status===UploaderStatus.UPLOADING}

                    >
                        {({ getRootProps, getInputProps, open }) => (
                            <div style={{ outline: 'none', minHeight: '100%' }}{...getRootProps()}>
                                <input {...getInputProps()} />

                                {this.renderFiles()}
                                
                                {this.props.status === UploaderStatus.FILE_LIST &&
                                    <div className="add-file" onClick={() => open()}>
                                        <FontAwesomeIcon className="add-file-img" icon="folder-plus" />
                                        <div className="d-inline add-file-text">{t('upload.listFile.addFile')}</div>
                                    </div>
                                }
                            </div>

                        )}
                    </Dropzone>
                </div>
                <div className="list-footer">
                    <button onClick={this.createFiles} disabled={this.state.isButtonDisabled} className="blue-btn">{t('upload.listFile.upload')}</button>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateProgress: (fileId, progress) => dispatch(updateProgress(fileId, progress)),
        startUploading: () => dispatch(startUploading()), 
        endUploading: () => dispatch(endUploading())
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.uploader.status
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Listfiles))
