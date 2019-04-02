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
    uploadName: '',
    options: false,
    images: [],
    galleryOnly: false,
  }

  constructor() {
    super();
    this.uploadService = new UploadService();
    this.selectBackgroundRef = React.createRef();
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
    const { images } = this.state;
    // Returns the ID to the main component
    onUploadCreated(data.id);

    const prom = images.map(image => () => this.uploadService.uploadBackground(data.id, image));
    const uploadPromises = files.map(file => () => uploadFile(data.id, file, (event) => {
      this.onUploadProgress(file.id, event);
    }));

    promiseSerial([...prom, ...uploadPromises]).then(() => {
      this.uploadService.putComplete(data.id);
      endUploading();
    });
  }

  createFiles = () => {
    const { files, startUploading, publicUpload } = this.props;
    const { uploadName, galleryOnly } = this.state;

    startUploading();

    const filesData = files.map(file => ({
      id: file.id,
      name: file.fileInput.name,
      size: file.fileInput.size,
    }));

    this.uploadService.createUpload(filesData, uploadName, galleryOnly, publicUpload)
      .then((res) => {
        this.beginUpload(res.data);
      });

    this.setState({
      isButtonDisabled: true,
    });
  }

  changeUploadName = (e) => {
    this.setState({
      uploadName: e.target.value,
    });
  }

  showOptions = () => {
    const { options } = this.state;
    this.setState({
      options: !options,
    });
  }

  onPreview = (e) => {
    const imagesUrls = Array.from(e.target.files);
    this.setState({
      images: imagesUrls,
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
    const {
      isButtonDisabled, options, images, uploadName, galleryOnly,
    } = this.state;
    return (
      <div className="listfiles">
        <div className="d-flex justify-content-between align-items-center">
          <div className="list-title">{t('upload.listFile.title')}</div>
          {!publicUpload
            && (
              options ? (
                <button type="button" className="btn green-btn option-btn" onClick={this.showOptions}>{t('upload.listFile.save')}</button>
              ) : (
                <button type="button" className="btn green-btn option-btn" onClick={this.showOptions}>{t('upload.listFile.options')}</button>
              )
            )}
        </div>
        <hr />
        {options ? (
          <div className="options-container">
            <div className="mt-3">
              <div className="list-file-name">{t('upload.listFile.uploadName')}</div>
              <div className="input-group input-group-sm">
                <input value={uploadName} type="text" className="form-control mt-1" placeholder="Upload name" onChange={this.changeUploadName} />
              </div>
            </div>
            <div className="form-check mt-3">
              <label className="form-check-label list-file-name mt-0" htmlFor="gallery_only">
                <input type="checkbox" checked={galleryOnly} className="form-check-input" id="gallery_only" onChange={(e) => { this.setState({ galleryOnly: e.target.checked }); }} />
                Show only gallery
              </label>
            </div>
            <div className="mt-4 d-flex">
              <div className="list-file-name mr-2">{t('upload.listFile.uploadBackground')}</div>
              <button
                type="button"
                className="btn blue-btn option-upload-btn"
                onClick={() => { this.selectBackgroundRef.current.click(); }}
              >
                {t('upload.listFile.uploadImage')}
              </button>
              <input
                ref={this.selectBackgroundRef}
                type="file"
                id="background"
                accept="image/x-png,image/jpeg"
                multiple="multiple"
                className="input-logo"
                onChange={this.onPreview}
              />
            </div>
            <div className="option-preview-container mt-3">
              {images.map(image => (
                <img width={82} height={50} src={URL.createObjectURL(image)} className="option-preview-img" alt="" />
              ))
              }
            </div>
          </div>
        ) : (
          <div>
            <div className="list-container">
              <Dropzone
                onDrop={this.onDrop}
                onClick={evt => evt.preventDefault()}
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
        )}
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
