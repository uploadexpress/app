import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import File from './File';
import UploadService from '../../../services/Api/UploadService';
import uploadFile from '../../../services/FileUploader';
import promiseSerial from '../../../helpers/promiseSerial';
import { updateProgress, startUploading, endUploading } from '../actions';
import buttonize from '../../../helpers/buttonize';
import { UploaderStatus } from '../constants';

class Listfiles extends Component {
  state = {
    isButtonDisabled: false,
    uploadName: 'Unnamed',
  }

  constructor() {
    super();
    this.uploadService = new UploadService();
  }

  onUploadProgress = (fileId, progressEvent) => {
    const { updateProgress } = this.props;
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    updateProgress(fileId, percentCompleted);
  }

  onDrop = (acceptedFiles) => {
    const { onFilesSelected } = this.props;
    onFilesSelected(acceptedFiles);
  }

  beginUpload = (data) => {
    const { files, onUploadCreated, endUploading } = this.props;
    // Returns the ID to the main component
    onUploadCreated(data.id);

    const uploadPromises = files.map(file => () => uploadFile(data.id, file, (event) => {
      this.onUploadProgress(file.id, event);
    }));

    promiseSerial(uploadPromises).then(() => {
      this.uploadService.putComplete(data.id);
      endUploading();
    });
  }

  createFiles = () => {
    const { files, startUploading, publicUpload } = this.props;
    const { uploadName } = this.state;

    startUploading();

    const filesData = files.map(file => ({
      id: file.id,
      name: file.fileInput.name,
      size: file.fileInput.size,
    }));

    this.uploadService.createUpload(filesData, uploadName, publicUpload).then((res) => {
      this.beginUpload(res.data);
    });

    this.setState({
      isButtonDisabled: true,
    });
  }

  uploadName = (e) => {
    this.setState({
      uploadName: e.target.value,
    });
  }

  renderFiles() {
    const { files } = this.props;
    return files.map(file => (
      <File
        key={file.id}
        name={file.fileInput.name}
        progress={file.progress}
        status={file.status}
        id={file.id}
      />
    ));
  }

  render() {
    const { t, publicUpload, status } = this.props;
    const { isButtonDisabled } = this.state;
    return (
      <div className="listfiles">
        <div>
          <div className="list-title">{t('upload.listFile.title')}</div>
          { !publicUpload
            && (
              <div className="upload-name">
                <div className="input-group input-group-sm mb-3">
                  <input type="text" className="form-control" placeholder="Upload name" onChange={this.uploadName} />
                </div>
              </div>
            )}
          <hr />
        </div>
        <div className="list-container">
          <Dropzone
            onDrop={this.onDrop}
            disableClick
            disabled={status === UploaderStatus.UPLOADING}
          >
            {({ getRootProps, getInputProps, open }) => (
              <div style={{ outline: 'none', minHeight: '100%' }} {...getRootProps()}>
                <input {...getInputProps()} />

                {this.renderFiles()}

                {status === UploaderStatus.FILE_LIST
                  && (
                    /* eslint-disable */ // (Taken care with buttonize)
                    <div 
                      {...buttonize(open)}
                      className="add-file" onClick={open}
                    >
                      <FontAwesomeIcon className="add-file-img" icon="folder-plus" />
                      <div className="d-inline add-file-text">{t('upload.listFile.addFile')}</div>
                    </div>
                    /* eslint-enable */
                  )
                }
              </div>

            )}
          </Dropzone>
        </div>
        <div className="list-footer">
          <button type="button" onClick={this.createFiles} disabled={isButtonDisabled} className="blue-btn">{t('upload.listFile.upload')}</button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateProgress: (fileId, progress) => dispatch(updateProgress(fileId, progress)),
  startUploading: () => dispatch(startUploading()),
  endUploading: () => dispatch(endUploading()),
});

const mapStateToProps = state => ({
  status: state.uploader.status,
});

Listfiles.defaultProps = {
  publicUpload: false,
};

Listfiles.propTypes = {
  t: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  startUploading: PropTypes.func.isRequired,
  updateProgress: PropTypes.func.isRequired,
  onUploadCreated: PropTypes.func.isRequired,
  onFilesSelected: PropTypes.func.isRequired,
  endUploading: PropTypes.func.isRequired,
  publicUpload: PropTypes.bool,
  shouldDisplayName: PropTypes.bool.isRequired,
  status: PropTypes.symbol.isRequired,
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Listfiles));
