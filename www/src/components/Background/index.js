import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import ReactFlagsSelect from '../FlagsSelect';
import socialNetworks from '../../helpers/socialNetworks';

const backgroundStyle = (image) => {
  const backgroundImage = image === null ? 'linear-gradient(#2193b0, #6dd5ed)' : `url(${image})`;
  return {
    backgroundImage,
    height: '100vh',
    width: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundColor: 'black',
    position: 'relative',
    transition: '2s',
  };
};

class Background extends React.Component {
  state = {
    backgroundUrl: null,
    currentIndex: 0,
  }

  componentDidMount = () => {
    const { settings } = this.props;
    if (settings.backgrounds.length > 0) {
      settings.backgrounds.forEach((element) => { new Image().src = element.url; });
      this.setState({
        backgroundUrl: settings.backgrounds[0].url,
        currentIndex: 0,
      });
    }
    setInterval(this.changeBackgroundImage, 5000);
  }

  changeBackgroundImage = () => {
    const { settings } = this.props;
    const { currentIndex } = this.state;
    if (settings.backgrounds.length > 0) {
      const index = currentIndex >= settings.backgrounds.length - 1 ? 0 : currentIndex + 1;
      this.setState({
        backgroundUrl: settings.backgrounds[index].url,
        currentIndex: index,
      });
    }
  }

  withHttp = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `http://${url}`;
    }
    return url;
  }

  renderLinks = () => {
    const { settings } = this.props;
    return settings.links.map(setting => (
      <a className="menu-link ml-2" href={this.withHttp(setting.url)} rel="noopener noreferrer" target="_blank">{setting.name}</a>
    ));
  }

  socialIcon = (key) => {
    const social = socialNetworks.find(network => network.key === key);
    return social.icon;
  }

  renderSocials = () => {
    const { settings } = this.props;
    return settings.social_networks.map(network => (
      network.url !== undefined
      && (
        <a className="menu-link" href={this.withHttp(network.url)} rel="noopener noreferrer" target="_blank">
          <FontAwesomeIcon
            className="social-account"
            icon={this.socialIcon(network.key)}
          />
        </a>
      )
    ));
  }

  render() {
    const { i18n, settings, children } = this.props;
    const { backgroundUrl } = this.state;
    const onSelectFlag = (countryCode) => {
      i18n.changeLanguage(countryCode);
    };
    const currLang = i18n.language.split('-')[0].toUpperCase();

    return (
      <div style={backgroundStyle(backgroundUrl)} className="background">

        <div className="menu" style={{ color: settings.color, justifyContent: settings.menu_position }}>
          {this.renderLinks()}
          {this.renderSocials()}

          <ReactFlagsSelect
            countries={i18n.languages}
            selectedSize={14}
            optionsSize={12}
            defaultCountry={currLang.toLowerCase()}
            placeholder="Select Language"
            onSelect={onSelectFlag}
          />
        </div>
        <div className="content-wrapper d-flex flex-column" style={{ alignItems: settings.upload_position }}>
          {settings.logo
            && (
              <div className="logo">
                <img src={settings.logo.url} alt="" />
              </div>
            )
          }
          <div className={settings.upload_position === 'flex-end' ? ('d-flex flex-row-reverse') : ('d-flex')}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
});

Background.propTypes = {
  i18n: PropTypes.shape({}).isRequired,
  settings: PropTypes.shape({}).isRequired,
  children: PropTypes.element.isRequired,
};

export default withTranslation()(connect(mapStateToProps)(Background));
