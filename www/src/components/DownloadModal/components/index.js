import React, { Component } from 'react';
import Background from '../../Background';
import Modal from '../../Modal';
import File from './File';
import '../style/index.css';
import { Link } from 'react-router-dom'

class DownloadModal extends Component {
   

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
                             <button onClick = {this.props.onZipDownload} className="green-btn">Download</button>

                             {this.props.preview &&
                                <Link to="/preview" className="preview-btn"> Preview </Link>
                             } 

                             
                        
                        </div>
                    </div>

                </Modal>

                </div>
            </Background>
        )
    }
}

export default DownloadModal