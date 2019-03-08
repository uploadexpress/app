import React, { Component } from 'react';
import Modal from '../../Modal';
import ImagePreview from './ImagePreview';
import { connect } from 'react-redux'
import Gallery from 'react-photo-gallery'
import { selectFile } from '../../../scenes/Download/actions'

class Preview extends Component {
    selectFile = (event, { photo }) => {
        this.props.selectFile(photo.id, !photo.selected)
    }

    render() {
        return (
            <div className="ml-3">
                <Modal width={700} height={370}>
                    <div className="listfiles">
                        <div className='list-container m-2'>
                            <Gallery
                                columns={3}
                                ImageComponent={ImagePreview}
                                direction={"column"}
                                onClick={this.selectFile}
                                photos={this.props.files.map((file) => {
                                    return (
                                        file.preview_url ? (
                                            { id: file.id, src: file.preview_url, width: file.preview_width, height: file.preview_height, selected: file.selected }
                                        ) : (
                                                null
                                            )
                                    )
                                })} />
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        files: state.downloader.files
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectFile: (id, selected) => dispatch(selectFile(id, selected))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview)