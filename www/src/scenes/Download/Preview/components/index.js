import React, { Component } from 'react';
import Modal from '../../../../components/Modal';
import Background from '../../../../components/Background';
import ImagePreview from './ImagePreview';
import { connect } from 'react-redux'

class Preview extends Component {
    render() {
        return (
            <Background>
                <Modal height={400} width={700}>
                    <div className="listfiles">
                        <div className="list-title">Oxana & Maxence wedding</div>
                        <hr />
                        <div className='list-container'>
                            <div className="list-body d-flex justify-content-center flex-wrap">
                                {this.props.files.map ((file) => {
                                    return (
                                        file.preview_url ? (
                                            <ImagePreview previewUrl = {file.preview_url} />
                                        ) : (
                                            null
                                        )
                                    )
                                })}     
                            </div>
                        </div>
                        <div className="list-footer">
                            <button className="green-btn">Download</button>
                        </div>
                    </div>
                </Modal>
            </Background>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        files: state.downloader.files
    }
}

export default connect(mapStateToProps)(Preview)