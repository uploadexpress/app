import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ObjectID from 'bson-objectid';
import { withTranslation } from 'react-i18next';
import Modal from '../../Modal/index';
import Dropfile from './Dropfile';
import Listfiles from './Listfiles';
import { addFiles } from '../../../actions/uploader';
import { FileStatus, UploaderStatus } from '../constants';
import '../style/index.css';
import LinkPreview from './LinkPreview';
import Oops from '../../OopsPage';


class Upload extends Component {
  state = {
    id: null,
  }

  onFilesSelected = (files) => {
    const { addFiles } = this.props;
    const formattedFiles = files.map(file => ({
      fileInput: file,
      id: ObjectID().toHexString(),
      progress: 0,
      status: FileStatus.EMPTY,
    }));

    addFiles(formattedFiles);
  }

  onUploadCreated = (id) => {
    this.setState({ id });
  }

  render() {
    const {
      status,
      publicUpload,
      shouldDisplayOptions,
      files,
      description,
      requestId,
      error,
    } = this.props;
    const { id } = this.state;

    if (error) {
      return (
        <Modal>
          <Oops />
        </Modal>
      );
    }

    return (
      <Modal>
        {status === UploaderStatus.NO_FILES
          && <Dropfile onFilesSelected={this.onFilesSelected} description={description} />
        }
        {(status === UploaderStatus.FILE_LIST
          || status === UploaderStatus.UPLOADING)
          && (
            <Listfiles
              publicUpload={publicUpload}
              shouldDisplayOptions={shouldDisplayOptions}
              onFilesSelected={this.onFilesSelected}
              onUploadCreated={this.onUploadCreated}
              files={files}
              requestId={requestId}
            />
          )
        }
        {status === UploaderStatus.DONE
          && <LinkPreview id={id} requestId={requestId} />
        }
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addFiles: (files) => { dispatch(addFiles(files)); },
  };
}

function mapStateToProps(state) {
  return {
    files: state.uploader.files,
    status: state.uploader.status,
  };
}

Upload.defaultProps = {
  shouldDisplayOptions: false,
  publicUpload: true,
  description: '',
  requestId: '',
  error: false,
};

Upload.propTypes = {
  addFiles: PropTypes.func.isRequired,
  status: PropTypes.symbol.isRequired,
  publicUpload: PropTypes.bool,
  shouldDisplayOptions: PropTypes.bool,
  files: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  description: PropTypes.string,
  requestId: PropTypes.string,
  error: PropTypes.bool,

};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Upload));
