import React, { Component } from 'react'
import Portal from '../../index'
import '../../style/index.css';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { setSetting, deleteBackground } from '../actions';
import SettingsService from '../../../../services/Api/SettingsService';
import { SketchPicker } from 'react-color';
import DownloadModal from '../../../../components/DownloadModal/components'

class Settings extends Component {

  state = {
    saved: false,
    logo: null,
    backgrounds: []
  }

  constructor() {
    super()
    this.settingsService = new SettingsService()
  }

  onInputChange = (name, value) => {
    this.props.setSetting(name, value)
    this.setState({
      saved: false
    })
  }

  sendSettings = () => { 
    this.settingsService.sendSettings(this.props.settings);
    this.setState({
      saved: true
    })

  }

  onLogoChange = (e) => {
    var logo = e.target.files[0]
    this.settingsService.sendLogo(logo).then(res => {
      this.props.setSetting ("logo", res.data.logo)
 
    })
  }

  onBackgroundChange = (e) => {
     var backgrounds = Array.from(e.target.files);
     backgrounds.forEach(background => { 
      this.settingsService.sendBackground(background).then( res => {
        this.props.setSetting("backgrounds", res.data.backgrounds)
      })
     });
  }

  deleteBackgroundPreview = (id) => {
    this.settingsService.deleteBackground(id).then(
      () => {
        this.props.deleteBackground(id)
      }
    )
  }

  render() {
    const { t } = this.props;
    return (
      <Portal history={this.props.history}>
        <div className="container-fluid p-0">
          <div className="row no-gutters">
            <div className="col-md-4 settings-container">
              <div className="container">
                <div className="row">
                  <div className="col-12 d-flex mt-4">
                    <div className="flex-grow-1 container-name">{t('panel.settings.administration')}</div>
                    {(this.state.saved) ? (
                      <div className="settings-saved">Saved</div>
                    ) : (
                        <button className="btn btn-pannel" onClick={this.sendSettings}>{t('panel.settings.save')}</button>
                      )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="settings-section">{t('panel.settings.pageStyling')}</div>
                    <hr className='ordinary-hr' />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="settings-title">{t('panel.settings.title')}</div>
                    <div className="settings-subtitle">{t('panel.settings.titleDescription')}</div>
                    <div className="settings-input-container">
                      <input type="text" className="form-control settings-input" placeholder="Gaspal" value={this.props.settings.name} onChange={(e) => { this.onInputChange("name", e.target.value) }}></input>
                      <div className="settings-input-description">{t('panel.settings.companyName')}</div>
                    </div>
                    <div className="settings-input-container">
                      <input type="text" className="form-control" placeholder="The app that lets you find the cheapest gas station around you" value={this.props.settings.description} onChange={(e) => { this.onInputChange("description", e.target.value) }} />
                      <div className="settings-input-description">{t('panel.settings.companyDescription')}</div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-8">
                    <div className="settings-title">{t('panel.settings.backgroundImage')}</div>
                    <div className="settings-subtitle">{t('panel.settings.backgroundDescription')}</div>
                  </div>
                  <div className="col-md-4 mt-auto mb-auto">
                    <label htmlFor="background"> <a className="btn btn-pannel-grey">Upload Image</a></label>
                    <input type="file" id="background" accept="image/x-png,image/jpeg" multiple="multiple" className="input-logo" onChange={this.onBackgroundChange} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex flex-wrap justify-content-center ">
                      {this.props.settings.backgrounds.map((background) => {
                        return (
                          <div className="settings-img-preview d-flex flex-column p-2">
                            <img width={82} height={50} src={background.url} alt="" />
                            <button type="button" onClick={() => { this.deleteBackgroundPreview(background.id) }} className="settings-delete-btn btn btn-sm">Delete</button>
                          </div>
                        )
                      })}
                    </div>
                  </div>


                </div>

                <div className="row">
                  <div className="col-md-8">
                    <div className="settings-title">Your logo</div>
                    <div className="settings-subtitle">Your logo will be shown on top of download window.</div>
                  </div>
                  <div className="col-md-4 mt-auto mb-auto">
                    <label htmlFor="logo"><a className="btn btn-pannel-grey">Upload Image</a></label>
                    <input type="file" id="logo" className="input-logo" accept="image/x-png,image/jpeg" onChange={this.onLogoChange} />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 d-flex flex-column justify-content-between align-items-start">
                    <div class="form-group mb-0">
                      <label for="upload-position" className="settings-title">Upload position</label>
                      <div className="settings-subtitle">Choose position of upload window on the screen</div>
                    </div>
                    <select value={this.props.settings.upload_position} class="form-control" id="upload-position" onChange={(e) => { this.onInputChange("upload_position", e.target.value) }}>
                        <option value="flex-start">left</option>
                        <option value="center">center</option>
                        <option value="flex-end">right</option>
                      </select>
                  </div>

                  <div className="col-md-6 d-flex flex-column justify-content-between align-items-start">
                    <div class="form-group mb-0">
                      <label for="menu-position" className="settings-title">Social account links position</label>
                      <div className="settings-subtitle">Choose position of social account links on the screen</div>
                      
                    </div>
                    <select class="form-control" value={this.props.settings.menu_position} id="upload-position" onChange={(e) => { this.onInputChange("menu_position", e.target.value) }}>
                        <option value="flex-start">left</option>
                        <option value="center">center</option>
                        <option value="flex-end">right</option>
                      </select>
                  </div>


                  <div className="col-md-12 text-center">
                    <div className="settings-title">Social account links color</div>
                    <div className="settings-subtitle">Choose a color of social account links on the screen</div>
                    <SketchPicker
                      color={this.props.settings.color}
                      onChangeComplete={(color) => { this.onInputChange("color", color.hex) }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="settings-section">{t('panel.settings.identity')}</div>
                    <hr className='ordinary-hr' />
                  </div>
                </div>



                <div className="row">
                  <div className="col-md-12">
                    <div className="settings-title">{t('panel.settings.socialAccounts')}</div>
                    <div className="settings-subtitle">{t('panel.settings.links')}</div>
                    <div className="settings-input-container">
                      <input type="text" className="form-control settings-input" placeholder="https://www.facebook.com/gaspalFR" value={this.props.settings.facebook} onChange={(e) => { this.onInputChange("facebook", e.target.value) }}></input>
                      <div className="settings-input-description">{t('panel.settings.urlFacebook')}</div>
                    </div>
                    <div className="settings-input-container">
                      <input type="text" className="form-control settings-input" placeholder="https://www.twitter.com/gaspalFR" value={this.props.settings.twitter} onChange={(e) => { this.onInputChange("twitter", e.target.value) }}></input>
                      <div className="settings-input-description">{t('panel.settings.urlTweeter')}</div>
                    </div>
                    <div className="settings-input-container">
                      <input type="text" className="form-control settings-input" placeholder="https://www.instagram.com/gaspalFR" value={this.props.settings.instagram} onChange={(e) => { this.onInputChange("instagram", e.target.value) }}></input>
                      <div className="settings-input-description">{t('panel.settings.urlInstagram')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="col-md-8">
              <DownloadModal files={[
                {
                  name: "image.png", id: "0000", size: 223
                }
              ]}
                onFileDownload={() => { }}
              />
            </div>
          </div>
        </div>
      </Portal>
    )
  }
}

const mapStatetoProps = (state) => {
  return {
    settings: state.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSetting: (name, value) => dispatch(setSetting(name, value)),
    deleteBackground: (id) => dispatch(deleteBackground(id))
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(withTranslation()(Settings))