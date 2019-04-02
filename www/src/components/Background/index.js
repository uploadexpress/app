import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import ReactFlagsSelect from '../FlagsSelect';
import socialNetworks from '../../helpers/socialNetworks';
import './style/index.css';

const backgroundStyle = (image) => {
  const backgroundImage = image === null ? 'linear-gradient(#2193b0, #6dd5ed)' : `url(${image})`;
  return {
    backgroundImage,
    minHeight: '100vh',
    width: '100%',
    backgroundPosition: 'center',
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
    const { settings, downloadBackgrounds } = this.props;
    const backgrounds = downloadBackgrounds.length > 0 ? downloadBackgrounds : settings.backgrounds;
    if (backgrounds.length > 0) {
      const backgroundUrls = backgrounds.map(background => (background.url));
      this.setState({
        backgrounds: backgroundUrls,
        backgroundUrl: backgroundUrls[0],
        currentIndex: 0,
      });
    }
    setInterval(this.changeBackgroundImage, 5000);
  }

  changeBackgroundImage = () => {
    const { currentIndex, backgrounds } = this.state;
    if (backgrounds.length > 0) {
      const index = currentIndex >= backgrounds.length - 1 ? 0 : currentIndex + 1;
      this.setState({
        backgroundUrl: backgrounds[index],
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
    const {
      i18n,
      settings,
      children,
    } = this.props;

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
        <div className="content-wrapper d-flex flex-column gallery-wrapper" style={{ alignItems: settings.upload_position }}>
          {settings.logo
            && (
              <div className="logo">
                <img src={settings.logo.url} alt="" />
              </div>
            )
          }

          {children}

        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
  downloadBackgrounds: state.downloader.backgrounds,
});

Background.propTypes = {
  i18n: PropTypes.shape({}).isRequired,
  settings: PropTypes.shape({}).isRequired,
  children: PropTypes.element.isRequired,
  downloadBackgrounds: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default withTranslation()(connect(mapStateToProps)(Background));
