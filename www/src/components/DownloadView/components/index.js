import React, { Component } from 'react';
import Background from '../../Background';
import Modal from '../../Modal';
import File from './File';
import Preview from './Preview'
import '../style/index.css';


class DownloadView extends Component {
    state = {
        showPreview: false
    }

    renderFiles() {
        return this.props.files.map(file => {
            return (
                <File
                    name={file.name}
                    id={file.id}
                    size={file.size}
                    onFileDownload={this.props.onFileDownload}
                />
            )
        })
    }

    showPreview = () => {
        this.setState({
            showPreview: !this.state.showPreview
        })
    }

    render() {
        return (
            <Background>
                <div className="d-flex">
                    <Modal>
                        <div className="listfiles">
                            <div className="list-title">Download</div>
                            <hr />
                            <div className='list-container'>
                                {this.renderFiles()}
                            </div>

                            <div className="list-footer">
                                <button onClick={this.props.onZipDownload} className="green-btn">Download</button>

                                {this.props.preview &&
                                    <a onClick={this.showPreview} className="preview-btn"> Preview </a>
                                }
                            </div>
                        </div>
                    </Modal>
                    { this.state.showPreview && 
                        <Preview />
                    }
                </div>
            </Background>
        )
    }
}

export default DownloadView