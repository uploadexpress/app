import React from 'react'
import PropTypes from 'prop-types'

const Modal = (props) => {
    return (
        <div className = "upload-modal" style={{height: props.height, width: props.width}}>
            {props.children}
        </div>
    )
}

Modal.defaultProps = {
    height: 387,
    width: 364
}

Modal.propTypes = {
	height: PropTypes.oneOfType([
        PropTypes.number, 
        PropTypes.string
    ]),

    width: PropTypes.oneOfType([
        PropTypes.number, 
        PropTypes.string
    ]),

}

export default Modal