import React, { Component } from 'react';
import Background from '../../Background';
import Modal from '../../Modal';
import File from './File';
import '../style/index.css';
import stringTruncate from '../../../helpers/stringTruncate'

class DownloadModal extends Component {
   

    renderFiles() {
        
        return this.props.files.map(file => {
            return (
                <File
                    name={stringTruncate(file.name, 25)}
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
                <Modal>
                    <div className="listfiles">
                        <div className="list-title">Download</div>
                        <hr />
                        <div className='list-container'>
                            {this.renderFiles()}
                        </div>

                        <div className="list-footer">
                             <button onClick = {this.props.onZipDownload} className="green-btn">Download</button> 
                        
                        </div>
                    </div>

                </Modal>
            </Background>
        )
    }
}

export default DownloadModal