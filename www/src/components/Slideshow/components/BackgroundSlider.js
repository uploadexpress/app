import React, { Component } from 'react';
import PropTypes from 'prop-types';
import generateStyleSheet from './generateStyleSheet';
import '../style/default.css';

class BackgroundSlider extends Component {
  state = {};

  componentWillMount = () => {
    this.updateImages();
  }

  componentWillReceiveProps = (nextProps) => {
    const { images } = this.props;
    if (images.length !== nextProps.images.length) {
      this.updateImages();
    }
  }

  updateImages = () => {
    let { images } = this.props;

    if (images.length > 5) {
      images = this.getRandomElementsFromArray(5, images);
    }

    this.setState({
      images,
    });
  }

  getRandomElementsFromArray = (n, array) => array
    .map(x => ({ x, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(a => a.x)
    .slice(0, n)

  render() {
    const { duration, transition } = this.props;
    const { images } = this.state;

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
  }
}

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
