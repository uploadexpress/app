import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import ReactFlagsSelect from '../FlagsSelect';

const backgroundStyle = image => ({
  backgroundImage: `url(${image})`,
  height: '100vh',
  width: '100%',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundColor: 'black',
  position: 'relative',
  transition: '2s',
});

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
          {settings.website
            && <a className="menu-link" href={this.withHttp(settings.website)} rel="noopener noreferrer" target="_blank">Website</a>
          }
          {settings.facebook
            && (
              <a className="menu-link" href={this.withHttp(settings.facebook)} rel="noopener noreferrer" target="_blank">
                <FontAwesomeIcon className="social-account" icon={['fab', 'facebook-f']} />
                {' '}
              </a>
            )
          }
          {settings.twitter
            && <a className="menu-link" href={this.withHttp(settings.twitter)} rel="noopener noreferrer" target="_blank"><FontAwesomeIcon className="social-account" icon={['fab', 'twitter']} /></a>
          }
          {settings.instagram
            && <a className="menu-link" href={this.withHttp(settings.instagram)} rel="noopener noreferrer" target="_blank"><FontAwesomeIcon className="social-account" href={settings.instagram} icon={['fab', 'instagram']} /></a>
          }

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
