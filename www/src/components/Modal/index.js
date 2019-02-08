import React from 'react'

const Modal = (props) => {
    return (
        <div className = "modal">
            {props.children}
        </div>
    )
}

export default Modal