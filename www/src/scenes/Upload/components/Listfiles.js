import React, { Component } from 'react';
import File from './File';
import api from '../../../services/Api'
import uploadFile from '../../../services/FileUploader'
import { promiseSerial } from '../../../helpers/promiseSerial';
import { updateProgress } from '../actions';
import { connect } from 'react-redux';

class Listfiles extends Component {
    state = {
        uploadId: null,
        filesToUpload: []
    }

    stringTruncate = (str, length) => {
        var dots = str.length > length ? '...' : '';
        return str.substring(0, length) + dots;
    };

    onUploadProgress = (fileId, progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        this.props.updateProgress(fileId, percentCompleted);
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

        promiseSerial(uploadPromises).then(console.log.bind(console))
    }

    createFiles = () => {
        let files = this.props.files.map(file => {
            return {
                'id': file.id,
                'name': file.fileInput.name,
                'size': file.fileInput.size
            }
        })

        api.createUpload(files).then(res => {
            this.beginUpload(res.data);
        })
    }

    renderFiles() {
        return this.props.files.map(file => {
            return (
                <File
                    name={this.stringTruncate(file.fileInput.name, 20)}
                    progress={file.progress}
                />
            )
        })
    }

    render() {
        return (
            <div className="listfiles">
                <div className="list-title">Your files</div>
                <hr />
                <div className='list-container'>
                    {this.renderFiles()}
                </div>

                <div className="list-footer">
                    <hr />
                    <button onClick={this.createFiles} className="blue-btn">Upload</button>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateProgress: (fileId, progress) => dispatch(updateProgress(fileId, progress))
    }
}

export default connect(null, mapDispatchToProps)(Listfiles)
