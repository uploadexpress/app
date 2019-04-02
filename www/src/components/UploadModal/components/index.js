import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ObjectID from 'bson-objectid';
import Modal from '../../Modal/index';
import Dropfile from './Dropfile';
import Listfiles from './Listfiles';
import { addFiles } from '../actions';
import { FileStatus, UploaderStatus } from '../constants';
import '../style/index.css';
import LinkPreview from './LinkPreview';

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
      status, publicUpload, shouldDisplayName, files,
    } = this.props;
    const { id } = this.state;


    return (
      <Modal>
        {status === UploaderStatus.NO_FILES
          && <Dropfile onFilesSelected={this.onFilesSelected} />
        }
        {(status === UploaderStatus.FILE_LIST
          || status === UploaderStatus.UPLOADING)
          && (
            <Listfiles
              publicUpload={publicUpload}
              shouldDisplayName={shouldDisplayName}
              onFilesSelected={this.onFilesSelected}
              onUploadCreated={this.onUploadCreated}
              files={files}
            />
          )
        }
        {status === UploaderStatus.DONE
          && <LinkPreview id={id} />
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
  shouldDisplayName: false,
  publicUpload: false,
};

Upload.propTypes = {
  addFiles: PropTypes.func.isRequired,
  status: PropTypes.symbol.isRequired,
  publicUpload: PropTypes.bool,
  shouldDisplayName: PropTypes.bool,
  files: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
