import React, { Component } from 'react'
import Portal from '../../index'
import '../../style/index.css';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { setSetting } from '../actions';
import SettingsService from '../../../../services/Api/SettingsService';
import { TwitterPicker } from 'react-color'

class Settings extends Component {

  state = {
    saved: false,
    logo: null
  }

  constructor(){
    super()
    this.settingsService = new SettingsService()
  }

  onInputChange = (name, value) => {
    this.props.setSetting( name, value )
    this.setState({
      saved: false
    })
  }

  sendSettings = () => {
    if (this.state.logo){
      this.settingsService.sendLogo(this.state.logo)
    }
    this.settingsService.sendSettings(this.props.settings);
    this.setState({
      saved: true
    })
  }

  onLogoChange = (e) => {
    this.setState({
      logo: e.target.files[0]
    })
  }


  render() {
    const { t } = this.props;
    return (
      <Portal history={this.props.history}>
        <div>
          <div className="container">
            <div className="row">
              <div className="col-12 d-flex justify-content-between mt-4">
                <div className="container-name">{t('panel.settings.administration')}</div>
                {(this.state.saved) ? (
                  <div className="settings-saved">Saved</div>
                ) : ( 
                  <button className="btn btn-pannel" onClick={this.sendSettings}>{t('panel.settings.save')}</button>
                )}  
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="settings-section">{t('panel.settings.pageStyling')}</div>
                <hr className='ordinary-hr' />
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-md-7">
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
              <div className="col-md-5"></div>
            </div>

            <div className="row">
              <div className="col-12 d-flex justify-content-between settings-input-container">
                <div>
                  <div className="settings-title">{t('panel.settings.backgroundImage')}</div>
                  <div className="settings-subtitle">{t('panel.settings.backgroundDescription')}</div>
                </div>
                <button className="btn btn-pannel-grey">{t('panel.settings.upload')}</button>
              </div>
            </div>
            <div className="row">
              <div className="col-12 d-flex justify-content-between settings-input-container">
                <div>
                  <div className="settings-title">Your logo</div>
                  <div className="settings-subtitle">Your logo will be shown on top of download window.</div>
                </div>
                <input type="file" className="btn btn-pannel-grey" onChange={this.onLogoChange} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div class="form-group">
                  <label for="upload-position" className="settings-title">Upload position</label>
                  <div className="settings-subtitle">Choose position of upload window on the screen</div>
                  <select value={this.props.settings.upload_position} class="form-control" id="upload-position" onChange={(e) => { this.onInputChange("upload_position", e.target.value) }}>
                    <option value="flex-start">left</option>
                    <option value="center">center</option>
                    <option value="flex-end">right</option>
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div class="form-group">
                  <label for="menu-position" className="settings-title">Social account links position</label>
                  <div className="settings-subtitle">Choose position of social account links on the screen</div>
                  <select class="form-control" value={this.props.settings.menu_position} id="upload-position" onChange={(e) => { this.onInputChange("menu_position", e.target.value) }}>
                    <option value="flex-start">left</option>
                    <option value="center">center</option>
                    <option value="flex-end">right</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="settings-title">Social account links color</div>
                <div className="settings-subtitle">Choose a color of social account links on the screen</div>
                <TwitterPicker 
                color={this.props.settings.color}
                onChangeComplete={ (color) => {this.onInputChange("color", color.hex) }}
                colors={['#000000', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#FFFFFF', '#F78DA7', '#9900EF']}
                triangle={'hide'}/>

              </div>
            </div>
          </div>


          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="settings-section">{t('panel.settings.identity')}</div>
                <hr className='ordinary-hr' />
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-md-7">
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
    setSetting: (name, value) => dispatch(setSetting(name, value))
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(withTranslation()(Settings))