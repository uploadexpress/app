import React from 'react';
import PropTypes from 'prop-types';
import generateStyleSheet from './generateStyleSheet';
import '../style/default.css';

const BackgroundSlider = (props) => {
  const { images, duration, transition } = props;

  if (images.length <= 1) {
    return (
      <div
        style={
          {
            backgroundImage: images.length < 1 ? 'linear-gradient(#2193b0, #6dd5ed)' : `url(${images[0]})`,
          }
        }
        className="default-background"
      />
    );
  }

  return (
    <div id="background-slider">
      {images.map((img, key) => (
        <figure
          key={img}
          style={{
            backgroundImage: `url(${img})`,
            animationDelay: `${(duration + transition) * key}s`,
          }}
        />
      ))}
      <style>
        {generateStyleSheet({
          imagesCount: images.length,
          duration,
          transition,
        })}
      </style>
    </div>
  );
};

BackgroundSlider.defaultProps = {
  duration: 10,
  transition: 2,
  images: [],
};

BackgroundSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  duration: PropTypes.number,
  transition: PropTypes.number,
};

export default BackgroundSlider;
