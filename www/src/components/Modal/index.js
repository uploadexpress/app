import React from 'react';
import PropTypes from 'prop-types';
import '../Background/style/index.css';

const Modal = (props) => {
  const { height, width, children } = props;
  return (
    <div className="upload-modal" style={{ height, width }}>
      {children}
    </div>
  );
};

Modal.defaultProps = {
  height: 370,
  width: 314,
};

Modal.propTypes = {
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),

  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,

  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),

};

export default Modal;
