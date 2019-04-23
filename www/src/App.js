import React, { Component, Suspense } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Spinner from 'react-spinkit';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Upload from './scenes/Upload/components';
import Download from './scenes/Download/components';
import Settings from './scenes/Portal/Settings';
import UploadList from './scenes/Portal/UploadList/components/index';
import SignIn from './scenes/Portal/SignIn/components/index';
import Setup from './scenes/Portal/Setup/components/index';
import SettingsService from './services/Api/SettingsService';
import { setSettings } from './actions/settings';
import importFontAwesome from './helpers/fontAwesome/importer';

importFontAwesome();

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
    const { settings } = this.props;
    return loading
      ? (<div className=" spinner d-flex justify-content-center align-items-center"><Spinner /></div>)
      : (
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <div className="App">
              <Route exact path="/" component={settings.public_uploader ? Upload : SignIn} />
              <Route exact path="/download/:id" component={Download} />
              <Route exact path="/panel" component={settings.setup ? UploadList : Setup} />
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

const mapStateToProps = state => ({
  settings: state.settings,
});

App.propTypes = {
  setSettings: PropTypes.func.isRequired,
  settings: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
