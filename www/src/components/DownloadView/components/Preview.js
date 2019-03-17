import React, { Component } from 'react';
import Modal from '../../Modal';
import ImagePreview from './ImagePreview';
import { connect } from 'react-redux'
import Gallery from 'react-photo-gallery'
import { selectFile } from '../../../scenes/Download/actions'
import Lightbox from 'react-images';

class Preview extends Component {
    state = {
        lightboxIsOpen: false,
        currentImage: 0,
    }

    closeLightbox = () => {
        this.setState({
            currentImage: 0,
            lightboxIsOpen: false,
        });
    }
    gotoPrevious = () => {
        this.setState({
            currentImage: this.state.currentImage - 1,
        });
    }
    gotoNext = () => {
        this.setState({
            currentImage: this.state.currentImage + 1,
        });
    }

    openLightbox = (event, { index }) => {
        event.preventDefault();
        this.setState({
            currentImage: index,
            lightboxIsOpen: true,
        });
    }


    render() {
        let images = this.props.files.filter((file) => {
            return file.preview_url
        })

        return (
            <div className="ml-3 mr-3">
                <Modal width={700} height={370}>
                    <div className="listfiles">
                        <div className='list-container m-2'>
                            <Gallery
                                columns={3}
                                ImageComponent={ImagePreview}
                                direction={"column"}
                                onClick={this.openLightbox}
                                photos={images.map((file) => {
                                    return  { id: file.id, onFileDownload: () => { this.props.onFileDownload(file.id) }, name: file.name, src: file.thumbnail_url, width: file.thumbnail_width, height: file.thumbnail_height, selected: file.selected }
                                })} />

                            <Lightbox
                                currentImage={this.state.currentImage}
                                images={images.map((file) => {
                                    return { src: file.preview_url }
                                })}
                                backdropClosesModal={true}
                                isOpen={this.state.lightboxIsOpen}
                                onClickPrev={this.gotoPrevious}
                                onClickNext={this.gotoNext}
                                onClose={this.closeLightbox}
                            />

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