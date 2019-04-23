/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImgDownloadPreview from '../../../img/img-download-preview.svg';
import ImgDownloadPreviewHover from '../../../img/img-download-preview-hover.svg';

const imgWithClick = { cursor: 'pointer' };

class Photo extends Component {
  state = {
    onHover: false,
  }

  onHover = (isHovering) => {
    this.setState({
      onHover: isHovering,
    });
  }

  render() {
    const {
      index, onClick, photo, margin, direction, top, left,
    } = this.props;
    const imgStyle = {
      margin,
    };
    if (direction === 'column') {
      imgStyle.position = 'absolute';
      imgStyle.left = left;
      imgStyle.top = top;
    }

    const handleClick = (event) => {
      onClick(event, { photo, index });
    };

    return (
      <div
        className="preview-container"
        onMouseEnter={() => { this.onHover(true); }}
        onMouseLeave={() => { this.onHover(false); }}
        style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
      >

        <img
          className={photo.selected ? 'preview-img selected' : 'preview-img'}
          onClick={onClick ? handleClick : null}
          {...photo}
        />

        {this.state.onHover
          && (
            <div className="card-body-preview">
              <div className="d-flex justify-content-between m-2">
                <div className="preview-img-name flex-text-truncate">
                  {photo.name}
                </div>
                <img width={24} className="preview-download-img" onClick={photo.onFileDownload} onMouseOver={e => e.currentTarget.src = ImgDownloadPreviewHover} onMouseOut={e => e.currentTarget.src = ImgDownloadPreview} src={ImgDownloadPreview} alt="" />
              </div>
            </div>
          ) 
        }
      </div>
    );
  }
}

export const photoPropType = PropTypes.shape({
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  alt: PropTypes.string,
  title: PropTypes.string,
  srcSet: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  sizes: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
});

Photo.propTypes = {
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  photo: photoPropType.isRequired,
  margin: PropTypes.number,
  top: (props) => {
    if (props.direction === 'column' && typeof props.top !== 'number') {
      return new Error('top is a required number when direction is set to `column`');
    }
  },
  left: (props) => {
    if (props.direction === 'column' && typeof props.left !== 'number') {
      return new Error('left is a required number when direction is set to `column`');
    }
  },
  direction: PropTypes.string,
};


export default Photo;
