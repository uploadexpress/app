import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Portal from '../../index';
import { setSetting, deleteBackground, deleteLogo } from '../actions';
import SettingsService from '../../../../services/Api/SettingsService';
import DownloadView from '../../../../components/DownloadView/components';
import '../../style/index.css';

class Settings extends Component {
  state = {
    saved: false,
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
                      <div className="settings-input-description">{t('panel.settings.companyName')}</div>
                    </div>
                    <div className="settings-input-container">
                      <input type="text" className="form-control" placeholder="Share your files easily" value={settings.description} onChange={(e) => { this.onInputChange('description', e.target.value); }} />
                      <div className="settings-input-description">{t('panel.settings.companyDescription')}</div>
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
                    { settings.logo
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

                <div className="row">
                  <div className="col-12">
                    <div className="settings-section">{t('panel.settings.identity')}</div>
                    <hr className="ordinary-hr" />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="settings-title">{t('panel.settings.socialAccounts')}</div>
                    <div className="settings-subtitle">{t('panel.settings.links')}</div>
                    <div className="settings-input-container">
                      <input type="text" className="form-control settings-input" placeholder="https://upload.express" value={settings.website} onChange={(e) => { this.onInputChange('website', e.target.value); }} />
                      <div className="settings-input-description">{t('panel.settings.urlWebsite')}</div>
                    </div>
                    <div className="settings-input-container">
                      <input type="text" className="form-control settings-input" placeholder="https://www.facebook.com/uploadexpress" value={settings.facebook} onChange={(e) => { this.onInputChange('facebook', e.target.value); }} />
                      <div className="settings-input-description">{t('panel.settings.urlFacebook')}</div>
                    </div>
                    <div className="settings-input-container">
                      <input type="text" className="form-control settings-input" placeholder="https://www.twitter.com/uploadexpress" value={settings.twitter} onChange={(e) => { this.onInputChange('twitter', e.target.value); }} />
                      <div className="settings-input-description">{t('panel.settings.urlTweeter')}</div>
                    </div>
                    <div className="settings-input-container">
                      <input type="text" className="form-control settings-input" placeholder="https://www.instagram.com/uploadexpress" value={settings.instagram} onChange={(e) => { this.onInputChange('instagram', e.target.value); }} />
                      <div className="settings-input-description">{t('panel.settings.urlInstagram')}</div>
                    </div>
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
