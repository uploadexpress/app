import React from 'react';

const backgroundStyle = {
    backgroundImage: `url('https://source.unsplash.com/random/1600x900')`,
    height: '100vh',
    width: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'relative'
}

const Background = (props) => {
    return(
        <div style = {backgroundStyle} className = "background">
            <div className = "logo-blue">upload<b className="logo-white">express</b></div>
            {props.children}
        </div>

    )
}

export default Background