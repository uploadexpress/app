import React, { Component } from 'react';
import File from './File';
import axios from 'axios'


class Listfiles extends Component {
    state = {
        uploadId: null,
        filesToUpload: []
    }

    stringTruncate = (str, length) => {
        var dots = str.length > length ? '...' : '';
        return str.substring(0, length) + dots;
    };

    beginUpload = (data) => {
        this.props.onUploadCreated(data.id);

        this.setState({
            uploadId: data.id,
            filesToUpload: data.files,
        });
    }

    createFiles = () => {
        axios.post('http://192.168.1.23:4000/v1/uploader/', {
            files: this.props.files.map(file => {
                return {
                    'name': file.name
                }
            })
        })
        .then(res => {
            this.beginUpload(res.data);
        })
    }

    render() {
        return (
            <div className="listfiles">
                <div className="list-title">Your files</div>
                <hr />
                <div className='list-container'>
                    {this.props.files.map(file => {
                        return (
                            <File name={this.stringTruncate(file.name, 20)} />
                        )
                    })
                    }
                </div>

                <div className="list-footer">
                    <hr />
                    <button onClick={this.createFiles} className="blue-btn">Upload</button>
                </div>
            </div>
        )
    }
}

export default Listfiles
