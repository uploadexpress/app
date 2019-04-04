import React from 'react';
import PropTypes from 'prop-types';
import generateStyleSheet from './generateStyleSheet';
import '../style/default.css';

const BackgroundSlider = (props) => {
  const { duration, transition } = props;
  let { images } = props;

  // 1 image or less: display gradient or default image
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

  // more than 5 images: select 5 random images from the array
  if (images.length > 5) {
    const n = 5;
    images = images
      .map(x => ({ x, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map(a => a.x)
      .slice(0, n);
  }

  return (
    <div id="background-slider" className="default-background">
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
