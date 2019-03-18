import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';
import Modal from '../../Modal';
import ImagePreview from './ImagePreview';
import { selectFile } from '../../../scenes/Download/actions';

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
    const { currentImage } = this.state;
    this.setState({
      currentImage: currentImage - 1,
    });
  }

  gotoNext = () => {
    const { currentImage } = this.state;
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


  render() {
    const { files, onFileDownload } = this.props;
    const { currentImage, lightboxIsOpen } = this.state;
    const images = files.filter(file => file.preview_url);

    return (
      <div className="ml-3 mr-3">
        <Modal width={700} height={370}>
          <div className="listfiles">
            <div className="list-container m-2">
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
                backdropClosesModal={true}
                customControls = {<button type="button"  onClick={() => {this.props.onFileDownload(images[this.state.currentImage].id)}} class="btn preview-download-btn btn-sm">Download</button>} 
                isOpen={lightboxIsOpen}
                onClickPrev={this.gotoPrevious}
                onClickNext={this.gotoNext}
                onClose={this.closeLightbox}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  files: state.downloader.files,
});

const mapDispatchToProps = dispatch => ({
  selectFile: (id, selected) => dispatch(selectFile(id, selected)),
});

Preview.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onFileDownload: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
