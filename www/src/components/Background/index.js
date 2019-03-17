import React from 'react';
import ReactFlagsSelect from '../FlagsSelect';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

const backgroundStyle = (image) => {
    return {
        backgroundImage: `url(${image})`,
        height: '100vh',
        width: '100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundColor: 'black',
        position: 'relative',
        transition: '2s'
    }
}

class Background extends React.Component {
    state = {
        backgroundUrl: null,
        currentIndex: 0
    }

    componentDidMount = () => {
        if (this.props.settings.backgrounds.length > 0) {
            this.props.settings.backgrounds.forEach((element) => { new Image().src = element.url })
            this.setState({
                backgroundUrl: this.props.settings.backgrounds[0].url,
                currentIndex: 0
            })
        }
        setInterval(this.changeBackgroundImage, 5000)
    }

    changeBackgroundImage = () => {
        if (this.props.settings.backgrounds.length > 0) {
            const index = this.state.currentIndex >= this.props.settings.backgrounds.length - 1 ? 0 : this.state.currentIndex + 1
            this.setState({
                backgroundUrl: this.props.settings.backgrounds[index].url,
                currentIndex: index
            })
        }
    }

    withHttp = (url) => {
        if (!/^https?:\/\//i.test(url)) {
            url = 'http://' + url;
        }
        return url
    }


    render() {
        const { i18n } = this.props;
        const onSelectFlag = (countryCode) => {
            i18n.changeLanguage(countryCode);
        }
        const currLang = i18n.language.split('-')[0].toUpperCase()

        return (
            <div style={backgroundStyle(this.state.backgroundUrl)} className="background">
                
                    <div className="menu" style={{ color: this.props.settings.color, justifyContent: this.props.settings.menu_position }} >
                        {this.props.settings.website &&
                            <a className="menu-link" href={this.withHttp(this.props.settings.website)} rel="noopener noreferrer" target="_blank" >Website</a>
                        }
                        {this.props.settings.facebook &&
                            <a className="menu-link" href={this.withHttp(this.props.settings.facebook)} rel="noopener noreferrer" target="_blank"><FontAwesomeIcon className="social-account" icon={['fab', 'facebook-f']} /> </a>
                        }
                        {this.props.settings.twitter &&
                            <a className="menu-link" href={this.withHttp(this.props.settings.twitter)} rel="noopener noreferrer" target="_blank"><FontAwesomeIcon className="social-account" icon={['fab', 'twitter']} /></a>
                        }
                        {this.props.settings.instagram &&
                            <a className="menu-link" href={this.withHttp(this.props.settings.instagram)} rel="noopener noreferrer" target="_blank"><FontAwesomeIcon className="social-account" href={this.props.settings.instagram} icon={['fab', 'instagram']} /></a>
                        }

                        <ReactFlagsSelect
                            countries={i18n.languages} selectedSize={14} optionsSize={12} defaultCountry={currLang.toLowerCase()} placeholder="Select Language" onSelect={onSelectFlag} />
                    </div>
                    <div className="content-wrapper d-flex flex-column" style={{alignItems: this.props.settings.upload_position}}>
                        {this.props.settings.logo &&
                            <div className="logo">
                                <img src={this.props.settings.logo.url} alt="" />
                            </div>
                        }
                        <div className={this.props.settings.upload_position == 'flex-end' ? ('d-flex flex-row-reverse'): ('d-flex')}>
                        {this.props.children}
                        </div>
                    </div>

              
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        settings: state.settings
    }
}

export default withTranslation()(connect(mapStateToProps)(Background))