import React, { Component } from 'react';
import Background from '../../../components/Background/index';
import Modal from '../../../components/Modal/index';
import File from './File';
import '../style/index.css';
import api from '../../../services/Api';
import stringTruncate from '../../../helpers/stringTruncate'


class Download extends Component{
    state = {
        downloadId: null,
        files: []
    }

    componentDidMount(){
        let id = this.props.match.params.id;
        api.getDownload(id).then((result) => {
            this.setState({
                files: result.data.files,
                downloadId: result.data.id
            })
        })
    }

    onFileDownload =(fileId) => {
        api.getFileDownloadUrl(this.state.downloadId, fileId).then((result) => {
            window.location = result.data.url
        })
    }

    renderFiles() {
        return this.state.files.map(file => {
            return (
                <File

                    name={stringTruncate(file.name, 25)}
                    id={ file.id }
                    size={file.size}
                    onFileDownload={this.onFileDownload}
                />
            )
        })
    }

    render(){
        console.log(this.props)
        return(
            <Background>
                <Modal>
                <div className="listfiles">
                <div className="list-title">Download</div>
                <hr />
                <div className='list-container'>
                    {this.renderFiles()}

                </div>

                <div className="list-footer">
                   {/* <button className="green-btn">Download</button> */}
                    <div className= "expire-text">expires in 7 days</div>
                </div>
            </div>

                </Modal>
            </Background>
        )
    }
}

export default Download