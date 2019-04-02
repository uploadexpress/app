import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ObjectID from 'bson-objectid';
import PropTypes from 'prop-types';
import Portal from '../../index';
import { setSetting, deleteBackground, deleteLogo } from '../actions';
import buttonize from '../../../../helpers/buttonize';
import SettingsService from '../../../../services/Api/SettingsService';
import DownloadView from '../../../../components/DownloadView/components';
import ImgCancel from '../../../../img/img-cancel.svg';
import '../../style/index.css';
import socialNetworks from '../../../../helpers/socialNetworks';

class Settings extends Component {
  state = {
    saved: false,
    selectedSocial: 'none',
  }

  constructor() {
    super();
    this.settingsService = new SettingsService();
    this.selectBackgroundRef = React.createRef();
    this.selectLogoRef = React.createRef();
  }

  onInputChange = (name, value) => {
    const { setSetting } = this.props;
    setSetting(name, value);
    this.setState({
      saved: false,
    });
  }

  onLinkUrlChange = (id, url) => {
    const { settings } = this.props;

    const newLinks = settings.links.map(link => ({
      ...link,
      url: link.id === id ? url : link.url,
    }));

    this.onInputChange('links', newLinks);
  }

  onSocialChange = (url, id) => {
    const { settings } = this.props;
    const newUrl = settings.social_networks.map(network => ({
      ...network,
      url: network.id === id ? url : network.url,
    }));
    this.onInputChange('social_networks', newUrl);
  }

  onLinkNameChange = (id, name) => {
    const { settings } = this.props;

    const newLinks = settings.links.map(link => ({
      ...link,
      name: link.id === id ? name : link.name,
    }));

    this.onInputChange('links', newLinks);
  }

  addLink = () => {
    const { settings } = this.props;

    const newLinks = [
      ...settings.links,
      {
        id: ObjectID().toHexString(),
        name: 'Name',
        url: 'https://upload.express',
      },
    ];

    this.onInputChange('links', newLinks);
  }

  removeLink = (id) => {
    const { settings } = this.props;

    const newLinks = settings.links.filter(link => (link.id !== id));

    this.onInputChange('links', newLinks);
  }

  removeSocial = (id) => {
    const { settings } = this.props;
    const newSocials = settings.social_networks.filter(network => (network.id !== id));
    this.onInputChange('social_networks', newSocials);
  }

  sendSettings = () => {
    const { settings } = this.props;
    this.settingsService.sendSettings(settings);
    this.setState({
      saved: true,
    });
  }

  onLogoChange = (e) => {
    const { setSetting } = this.props;
    const logo = e.target.files[0];
    this.settingsService.sendLogo(logo).then((res) => {
      setSetting('logo', res.data.logo);
    });
  }

  onBackgroundChange = (e) => {
    const { setSetting } = this.props;
    const backgrounds = Array.from(e.target.files);
    backgrounds.forEach((background) => {
      this.settingsService.sendBackground(background).then((res) => {
        setSetting('backgrounds', res.data.backgrounds);
      });
    });
  }

  deleteBackgroundPreview = (id) => {
    const { deleteBackground } = this.props;

    this.settingsService.deleteBackground(id).then(
      () => {
        deleteBackground(id);
      },
    );
  }

  deleteLogoPreview = () => {
    const { deleteLogo } = this.props;

    this.settingsService.deleteLogo().then(
      () => {
        deleteLogo();
      },
    );
  }

  onSocialSelect = (e) => {
    this.setState({
      selectedSocial: e.target.value,
    });
  }

  socialName = (key) => {
    const social = socialNetworks.find(network => network.key === key);
    return social.name;
  }

  addSocial = (e) => {
    const { selectedSocial } = this.state;
    const { settings } = this.props;

    const newSocials = [
      ...settings.social_networks,
      {
        id: ObjectID().toHexString(),
        key: selectedSocial,
      },
    ];

    this.setState({
      selectedSocial: 'none',
    });

    this.onInputChange('social_networks', newSocials);
    e.preventDefault();
  }

  renderSocialSettings = () => {
    const { t, settings } = this.props;
    const { selectedSocial } = this.state;
    return (
      <div>
        <form onSubmit={this.addSocial}>
          <div className="d-flex justify-content-between align-items-center mt-2 mb-4">
            <select value={selectedSocial} className="form-control mr-3" placeholder="Social Links" onChange={this.onSocialSelect}>
              <option disabled value="none">
                {t('panel.settings.chooseNetwork')}
              </option>
              {socialNetworks.filter(network => settings.social_networks
                .find(social => social.key === network.key) == null)
                .map(network => (
                  <option key={network.key} value={network.key}>
                    {this.socialName(network.key)}
                  </option>
                ))}
            </select>
            <input type="submit" className="btn btn-pannel" value={t('panel.settings.addNetwork')} />
          </div>
        </form>
        {settings.social_networks.map(network => (
          <div className="d-flex flex-column" key={network.id}>
            <div className="d-flex align-items-center">
              <img
                onClick={() => { this.removeSocial(network.id); }}
                className="mr-3"
                src={ImgCancel}
                alt=""
              />
              <div style={{ fontSize: '15px' }} className="settings-title mt-0">
                {t('panel.settings.yourNetworkUrl', { name: this.socialName(network.key) })}
              </div>
            </div>
            <div className="settings-input-container flex-grow-1">
              <input type="text" className="form-control" value={network.url} onChange={(e) => { this.onSocialChange(e.target.value, network.id); }} />
            </div>
          </div>
        ))}

      </div>
    );
  }

  renderLinkSettings = () => {
    const { settings, t } = this.props;
    return settings.links.map(link => (
      <div key={link.id} className="d-flex">
        {/* eslint-disable */}
        <img
          className="settings-remove-button"
          {...buttonize(() => { this.removeLink(link.id) })}
          onClick={() => { this.removeLink(link.id) }}
          src={ImgCancel}
          alt=""
        />
        {/* eslint-enable */}
        <div className="settings-input-container flex-grow-1 mr-4">
          <input type="text" className="form-control settings-input" placeholder="Name" value={link.name} onChange={(e) => { this.onLinkNameChange(link.id, e.target.value); }} />
          <div className="settings-input-description">{t('panel.settings.linkName')}</div>
        </div>
        <div className="settings-input-container flex-grow-1">
          <input type="text" className="form-control settings-input" placeholder="https://upload.express" value={link.url} onChange={(e) => { this.onLinkUrlChange(link.id, e.target.value); }} />
          <div className="settings-input-description">{t('panel.settings.linkUrl')}</div>
        </div>
      </div>
    ));
  }

  render() {
    const { t, history, settings } = this.props;
    const { saved } = this.state;
    return (
      <Portal history={history}>
        <div className="container-fluid p-0">
          <div className="row no-gutters">
            <div className="col-md-4 settings-container">
              <div className="container">
                <div className="row">
                  <div className="col-12 d-flex mt-4">
                    <div className="flex-grow-1 container-name">{t('panel.settings.administration')}</div>
                    {(saved) ? (
                      <div className="settings-saved">{t('panel.settings.saved')}</div>
                    ) : (
                      <button type="button" className="btn btn-pannel" onClick={this.sendSettings}>{t('panel.settings.save')}</button>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="settings-section">{t('panel.settings.pageStyling')}</div>
                    <hr className="ordinary-hr" />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="settings-title">{t('panel.settings.title')}</div>
                    <div className="settings-subtitle">{t('panel.settings.titleDescription')}</div>
                    <div className="settings-input-container">
                      <input type="text" className="form-control settings-input" placeholder="upload.express" value={settings.name} onChange={(e) => { this.onInputChange('name', e.target.value); }} />
                      <div className="settings-input-description">{t('panel.settings.title')}</div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-8">
                    <div className="settings-title">{t('panel.settings.backgroundImage')}</div>
                    <div className="settings-subtitle">{t('panel.settings.backgroundDescription')}</div>
                  </div>
                  <div className="col-md-4 text-center mt-auto mb-auto">
                    <button
                      type="button"
                      className="btn btn-pannel-grey"
                      onClick={() => { this.selectBackgroundRef.current.click(); }}
                    >
                      {t('panel.settings.uploadImg')}
                    </button>
                    <input
                      ref={this.selectBackgroundRef}
                      type="file"
                      id="background"
                      accept="image/x-png,image/jpeg"
                      multiple="multiple"
                      className="input-logo"
                      onChange={this.onBackgroundChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex flex-wrap justify-content-center ">
                      {settings.backgrounds.map(background => (
                        <div key={background.id} className="settings-img-preview d-flex flex-column p-2">
                          <img width={82} height={50} src={background.url} alt="" />
                          <button type="button" onClick={() => { this.deleteBackgroundPreview(background.id); }} className="settings-delete-btn btn btn-sm">{t('panel.settings.delete')}</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-8">
                    <div className="settings-title">{t('panel.settings.logo')}</div>
                    <div className="settings-subtitle">{t('panel.settings.logoDescription')}</div>
                  </div>
                  <div className="col-md-4 text-center mt-auto mb-auto">
                    <button
                      type="button"
                      onClick={() => { this.selectLogoRef.current.click(); }}
                      className="btn btn-pannel-grey"
                    >
                      {t('panel.settings.uploadImg')}
                    </button>
                    <input
                      ref={this.selectLogoRef}
                      type="file"
                      id="logo"
                      className="input-logo"
                      accept="image/x-png,image/jpeg"
                      onChange={this.onLogoChange}
                    />
                    {settings.logo
                      && <button type="button" onClick={() => { this.deleteLogoPreview(); }} className="settings-delete-btn btn btn-sm">{t('panel.settings.delete')}</button>
                    }
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 d-flex flex-column justify-content-between align-items-start">
                    <div className="form-group mb-0">
                      <label htmlFor="upload-position" className="settings-title">{t('panel.settings.uploadPosition')}</label>
                      <div className="settings-subtitle">{t('panel.settings.uploadPositionDescription')}</div>
                    </div>
                    <select value={settings.upload_position} className="form-control" id="upload-position" onChange={(e) => { this.onInputChange('upload_position', e.target.value); }}>
                      <option value="flex-start">{t('panel.settings.left')}</option>
                      <option value="center">{t('panel.settings.center')}</option>
                      <option value="flex-end">{t('panel.settings.right')}</option>
                    </select>
                  </div>

                  <div className="col-md-6 d-flex flex-column justify-content-between align-items-start">
                    <div className="form-group mb-0">
                      <label htmlFor="menu-position" className="settings-title">{t('panel.settings.menuPosition')}</label>
                      <div className="settings-subtitle">{t('panel.settings.menuPositionDescription')}</div>
                    </div>
                    <select className="form-control" value={settings.menu_position} id="upload-position" onChange={(e) => { this.onInputChange('menu_position', e.target.value); }}>
                      <option value="flex-start">{t('panel.settings.left')}</option>
                      <option value="center">{t('panel.settings.center')}</option>
                      <option value="flex-end">{t('panel.settings.right')}</option>
                    </select>
                  </div>

                  <div className="col-md-12 text-center">
                    <div className="settings-title">{t('panel.settings.menuColor')}</div>
                    <div className="settings-subtitle">{t('panel.settings.menuColorDescription')}</div>
                    <SketchPicker
                      color={settings.color}
                      onChangeComplete={(color) => { this.onInputChange('color', color.hex); }}
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12">
                    <div className="form-check">
                      <label className="form-check-label settings-section mt-0" htmlFor="public_upload">
                        <input type="checkbox" checked={settings.public_uploader} className="form-check-input" id="public_upload" onChange={(e) => { this.onInputChange('public_uploader', e.target.checked); }} />
                        {t('panel.settings.publicUploader')}
                      </label>
                      <div className="settings-subtitle">{t('panel.settings.publicUploaderDescription')}</div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="settings-section">{t('panel.settings.identity')}</div>
                    <hr className="ordinary-hr" />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="settings-title">{t('panel.settings.navigationLinksTitle')}</div>
                    <div className="settings-subtitle">{t('panel.settings.navigationLinksSubTitle')}</div>
                    {this.renderLinkSettings()}
                    {/* eslint-disable */}
                    <div
                      {...buttonize(this.addLink)}
                      className="settings-add-link" onClick={this.addLink}
                    >
                      <FontAwesomeIcon className="settings-add-link-img" icon="folder-plus" />
                      <div className="d-inline settings-add-link-text">{t('panel.settings.addLink')}</div>
                    </div>
                    {/* eslint-enable */}
                    <div className="settings-title">{t('panel.settings.socialAccounts')}</div>
                    <div className="settings-subtitle">{t('panel.settings.links')}</div>
                    {this.renderSocialSettings()}
                  </div>
                </div>
              </div>
            </div>


            <div className="col-md-8">
              <DownloadView
                files={[
                  {
                    name: 'image.png', id: '0000', size: 223,
                  },
                ]}
                onFileDownload={() => { }}
                preview={false}
              />
            </div>
          </div>
        </div>
      </Portal>
    );
  }
}

const mapStatetoProps = state => ({
  settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
  setSetting: (name, value) => dispatch(setSetting(name, value)),
  deleteBackground: id => dispatch(deleteBackground(id)),
  deleteLogo: () => dispatch(deleteLogo()),
});

Settings.propTypes = {
  history: PropTypes.shape({}).isRequired,
  t: PropTypes.func.isRequired,
  settings: PropTypes.shape({}).isRequired,
  setSetting: PropTypes.func.isRequired,
  deleteBackground: PropTypes.func.isRequired,
  deleteLogo: PropTypes.func.isRequired,
};

export default connect(mapStatetoProps, mapDispatchToProps)(withTranslation()(Settings));
