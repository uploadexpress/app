import React from 'react';
import ReactFlagsSelect from '../FlagsSelect';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {connect} from 'react-redux';
import Logo from '../../img/img-logo.png'


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
    const { i18n } = useTranslation();

    const onSelectFlag = (countryCode) => {
        i18n.changeLanguage(countryCode);
    }

    const currLang = i18n.language.split('-')[0].toUpperCase()
    console.log(props)
    return (
        <div style={backgroundStyle} className="background">
            <div className="background-window" style={{alignItems: props.settings.upload_position}}>
                <div className="menu" style={{color: props.settings.color, justifyContent:props.settings.menu_position}} >
                    <a className="menu-link" href={props.settings.facebook} rel="noopener noreferrer" target="_blank"><FontAwesomeIcon className="social-account" icon={['fab', 'facebook-f']} /> </a>
                    <a className="menu-link" href={props.settings.twitter} rel="noopener noreferrer" target="_blank"><FontAwesomeIcon className="social-account" icon={['fab', 'twitter']} /></a>
                    <a className="menu-link" href={props.settings.instagram} rel="noopener noreferrer" target="_blank"><FontAwesomeIcon className="social-account" href={props.settings.instagram} icon={['fab', 'instagram']} /></a>
                    <ReactFlagsSelect
                        countries={i18n.languages} selectedSize={14} optionsSize={12} defaultCountry={currLang} placeholder="Select Language" onSelect={onSelectFlag} /></div>
                <div className="logo">
                    {props.settings.logo &&
                    <img src={props.settings.logo} alt=""/>}
                </div>
                {props.children}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return{
        settings: state.settings
    }
}

export default connect (mapStateToProps) (Background)