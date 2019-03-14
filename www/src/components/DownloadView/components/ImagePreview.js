import React from 'react';
import PropTypes from 'prop-types';
import ImgSelected from '../../../img/img-preview-selected.svg'

const imgWithClick = { cursor: 'pointer' };

const Photo = ({ index, onClick, photo, margin, direction, top, left }) => {
  const imgStyle = { 
      margin: margin,
  };
  if (direction === 'column') {
    imgStyle.position = 'absolute';
    imgStyle.left = left;
    imgStyle.top = top;
  }

  const handleClick = event => {
    onClick(event, { photo, index });
  };

  return (
      <div className="preview-container" style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}>
    <img
      className={photo.selected ? 'preview-img selected': 'preview-img'}
      
      {...photo}
      onClick={onClick ? handleClick : null}
    />
    { photo.selected &&
        <div className="preview-selected-img">
            <img width={20} height={20} src={ImgSelected} alt="" />
        </div>
    }
    </div>
  );
};

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
  top: props => {
    if (props.direction === 'column' && typeof props.top !== 'number') {
      return new Error('top is a required number when direction is set to `column`');
    }
  },
  left: props => {
    if (props.direction === 'column' && typeof props.left !== 'number') {
      return new Error('left is a required number when direction is set to `column`');
    }
  },
  direction: PropTypes.string,
};

export default Photo;