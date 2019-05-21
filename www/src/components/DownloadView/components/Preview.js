import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../Modal';
import ImagePreview from './ImagePreview';
import { selectFile } from '../../../actions/downloader';
import '../style/index.css';


class Preview extends Component {
  state = {
    lightboxIsOpen: false,
    currentImage: 0,
    slideshow: false,
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  closeLightbox = () => {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  }

  gotoPrevious = () => {
    const { currentImage } = this.state;
    this.setState({
      currentImage: currentImage - 1,
    });
  }

  gotoNext = (imagesLength) => {
    const { currentImage } = this.state;
    if (currentImage === imagesLength - 1) {
      this.setState({
        currentImage: 0,
      });
      return;
    }
    this.setState({
      currentImage: currentImage + 1,
    });
  }

  openLightbox = (event, { index }) => {
    event.preventDefault();
    this.setState({
      currentImage: index,
      lightboxIsOpen: true,
    });
  }

  onSlideshow = (imagesLength) => {
    this.setState({
      slideshow: true,
    });
    this.interval = setInterval(() => {
      this.gotoNext(imagesLength);
    }, 5000);
  }

  stopSlideshow = () => {
    this.setState({
      slideshow: false,
    });
    clearInterval(this.interval);
  }

  render() {
    const {
      files, onFileDownload, galleryOnly, onZipDownload, uploadName,
    } = this.props;


    const { currentImage, lightboxIsOpen, slideshow } = this.state;
    const images = files.filter(file => file.preview_url);
    const modalWidth = galleryOnly ? 900 : 700;
    const modalHeight = galleryOnly ? 500 : 370;

    return (
      <Modal width={modalWidth} height={modalHeight}>
        <div className="listfiles">
          <div className="list-container-gallery m-2">
            <div className="d-flex justify-content-between align-items-center">
              <div className="preview-upload-name">{uploadName}</div>
              <button type="button" onClick={onZipDownload} className="btn btn-sm blue-btn-sm m-2"> Download all</button>
            </div>
            <Gallery
              columns={3}
              ImageComponent={ImagePreview}
              direction="column"
              onClick={this.openLightbox}
              photos={images.map(file => ({
                id: file.id,
                onFileDownload: () => { onFileDownload(file.id); },
                name: file.name,
                src: file.thumbnail_url,
                width: file.thumbnail_width,
                height: file.thumbnail_height,
                selected: file.selected,
              }))}
            />

            <Lightbox
              currentImage={currentImage}
              images={images.map(file => ({ src: file.preview_url }))}
              customControls={[
                <button type="button" onClick={() => { onFileDownload(images[currentImage].id); }} className="btn preview-download-btn btn-sm">Download</button>,
                (slideshow) ? (
                  <button type="button" className="btn-slideshow" onClick={this.stopSlideshow}>
                    <FontAwesomeIcon icon="pause" />
                  </button>
                ) : (
                  <button type="button" className="btn-slideshow" onClick={() => { this.onSlideshow(images.length); }}>
                    <FontAwesomeIcon icon="play" />
                  </button>
                ),
              ]}
              isOpen={lightboxIsOpen}
              onClickPrev={this.gotoPrevious}
              onClickNext={() => { this.gotoNext(images.length); }}
              onClose={this.closeLightbox}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  files: state.downloader.files,
  galleryOnly: state.downloader.galleryOnly,
  uploadName: state.downloader.uploadName,
});

const mapDispatchToProps = dispatch => ({
  selectFile: (id, selected) => dispatch(selectFile(id, selected)),
});

Preview.defaultProps = {
  onZipDownload: () => { },
};

Preview.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onFileDownload: PropTypes.func.isRequired,
  galleryOnly: PropTypes.bool.isRequired,
  onZipDownload: PropTypes.func,
  uploadName: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
