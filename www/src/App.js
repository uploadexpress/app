import React, { Component, Suspense } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFolderPlus, faKey, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Spinner from 'react-spinkit';
import { connect } from 'react-redux';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import PropTypes from 'prop-types';
import Upload from './scenes/Upload/components';
import Download from './scenes/Download/components';
import Settings from './scenes/Portal/Settings/components/index';
import UploadList from './scenes/Portal/UploadList/components/index';
import SignIn from './scenes/Portal/SignIn/components/index';
import Setup from './scenes/Portal/Setup/components/index';
import SettingsService from './services/Api/SettingsService';
import { setSettings } from './scenes/Portal/Settings/actions';

library.add(faFolderPlus, faKey, faEnvelope, faFacebookF, faTwitter, faInstagram);

class App extends Component {
  state = {
    loading: true,
  }

  componentDidMount() {
    const { setSettings } = this.props;
    this.settingsService = new SettingsService();
    this.settingsService.getSettings().then((settings) => {
      setSettings(settings.data);
      this.setState({ loading: false });
    });
  }

  render() {
    const { loading } = this.state;
    return loading
      ? (<div className=" spinner d-flex justify-content-center align-items-center"><Spinner /></div>)
      : (
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <div className="App">
              <Route exact path="/" component={Upload} />
              <Route exact path="/download/:id" component={Download} />
              <Route exact path="/panel" component={UploadList} />
              <Route exact path="/panel/settings" component={Settings} />
              <Route path="/panel/signin" component={SignIn} />
              <Route path="/panel/setup" component={Setup} />
            </div>
          </Suspense>
        </BrowserRouter>
      );
  }
}

const mapDispatchToProps = dispatch => ({
  setSettings: settings => dispatch(setSettings(settings)),
});

App.propTypes = {
  setSettings: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(App);
