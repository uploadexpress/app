import React, { Component } from 'react';
import Background from '../../../components/Background/index'
import Modal from '../../../components/Modal/index'
import Dropfile from './Dropfile'
import Listfiles from './Listfiles'
import { addFiles } from '../actions'
import { connect } from 'react-redux'
import { Status } from '../constants';
import ObjectID from 'bson-objectid'

class Upload extends Component {


    onFilesSelected = (files) => {
        const formattedFiles = files.map((file) => {
            return {
                fileInput: file,
                id: ObjectID().toHexString(),
                progress: 0,
                status: Status.WAITING
            }
        })

        this.props.addFiles(formattedFiles)
    }

    onUploadCreated = (id) => {
        this.setState({ id })
    }

    render() {
        return (
            <Background>
                <Modal>
                    {this.props.files.length !== 0 ?
                        <Listfiles onUploadCreated={this.onUploadCreated} files={this.props.files} />
                        : <Dropfile onFilesSelected={this.onFilesSelected} />}
                </Modal>
            </Background>
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
        files: state.uploader.files
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload);


