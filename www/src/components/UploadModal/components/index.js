import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Modal from '../../../components/Modal/index'
import Dropfile from './Dropfile'
import Listfiles from './Listfiles'
import { addFiles } from '../actions'
import { connect } from 'react-redux'
import { FileStatus, UploaderStatus } from '../constants';
import ObjectID from 'bson-objectid'
import '../style/index.css';
import LinkPreview from './LinkPreview'

class Upload extends Component {

    state = {
        id: null
    }


    onFilesSelected = (files) => {
        const formattedFiles = files.map((file) => {
            return {
                fileInput: file,
                id: ObjectID().toHexString(),
                progress: 0,
                status: FileStatus.EMPTY
            }
        })

        this.props.addFiles(formattedFiles)
    }

    onUploadCreated = (id) => {
        this.setState({ id })
    }

    render() {
        return (

            <Modal>
                {this.props.status === UploaderStatus.NO_FILES &&
                    <Dropfile onFilesSelected={this.onFilesSelected} />
                }
                {(this.props.status === UploaderStatus.FILE_LIST ||
                    this.props.status === UploaderStatus.UPLOADING) &&
                    <Listfiles shouldDisplayName={this.props.shouldDisplayName} onFilesSelected={this.onFilesSelected} onUploadCreated={this.onUploadCreated} files={this.props.files} />
                }
                {this.props.status === UploaderStatus.DONE &&
                    <LinkPreview id={this.state.id} />

                }
            </Modal>

        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addFiles: (files) => { dispatch(addFiles(files)) }
    };
}

function mapStateToProps(state) {
    return {
        files: state.uploader.files,
        status: state.uploader.status,
    }
}

Listfiles.defaultProps = {
    shouldDisplayName: false
}

Modal.propTypes = {
	shouldDisplayName: PropTypes.bool, 
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload);


