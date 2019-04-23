import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { availableLanguages } from '../../i18n';
import ReactFlagsSelect from '../FlagsSelect';
import socialNetworks from '../../helpers/socialNetworks';
import BackgroundSlider from '../Slideshow/components';

import './index.css';

class Background extends React.Component {
  withHttp = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `http://${url}`;
    }
    return url;
  }

  renderLinks = () => {
    const { settings } = this.props;
    return settings.links.map(setting => (
      <a className="menu-link ml-2" key={setting.url} href={this.withHttp(setting.url)} rel="noopener noreferrer" target="_blank">{setting.name}</a>
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
        <a className="menu-link" key={network.url} href={this.withHttp(network.url)} rel="noopener noreferrer" target="_blank">
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
      downloadBackgrounds,
    } = this.props;

    const backgrounds = downloadBackgrounds.length > 0 ? downloadBackgrounds : settings.backgrounds;
    const backgroundsUrls = backgrounds.map(background => (background.url));

    const onSelectFlag = (countryCode) => {
      i18n.changeLanguage(countryCode);
    };

    const currLang = i18n.language.split('-')[0].toUpperCase();

    return (
      <div className="background-container">
        <BackgroundSlider
          images={backgroundsUrls}
          duration={5}
          transition={1}
        />

        <div className="menu" style={{ color: settings.color, justifyContent: settings.menu_position }}>
          {this.renderLinks()}
          {this.renderSocials()}

          <ReactFlagsSelect
            countries={availableLanguages}
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
