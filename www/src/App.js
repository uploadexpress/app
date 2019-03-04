import React, { Component, Suspense } from 'react';
import Upload from './scenes/Upload/components';
import { BrowserRouter, Route } from 'react-router-dom';
import Download from './scenes/Download/components/index';
import Settings from './scenes/Portal/Settings/components/index'
import UploadList from './scenes/Portal/UploadList/components/index'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolderPlus, faKey, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import Spinner from 'react-spinkit'
import SignIn from './scenes/Portal/SignIn/components/index';
import Setup from './scenes/Portal/Setup/components/index';
import SettingsService from './services/Api/SettingsService';
import { connect } from 'react-redux';
import { setSettings } from './scenes/Portal/Settings/actions';
import Preview from './scenes/Portal/Settings/components/Preview'
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons' 

library.add(faFolderPlus, faKey, faEnvelope, faFacebookF, faTwitter, faInstagram)

class App extends Component {


  componentDidMount() {
    this.settingsService = new SettingsService();
    this.settingsService.getSettings().then((settings) => {
      this.props.setSettings(settings.data)
    })
  }
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <div className="App">
            <Route exact path='/' component={Upload} />
            <Route path='/download/:id' component={Download} />
            <Route exact path='/panel' component={UploadList} />
            <Route exact path='/panel/settings' component={Settings} />
            <Route path='/panel/signin' component={SignIn} />
            <Route path='/panel/setup' component={Setup} />
            <Route path='/panel/settings/preview' component={Preview} />
          </div>
        </Suspense>
      </BrowserRouter>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSettings: (settings) => dispatch(setSettings(settings))
  }
}

export default connect(null, mapDispatchToProps)(App);
