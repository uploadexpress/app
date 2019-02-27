import React, { Component, Suspense } from 'react';
import Upload from './scenes/Upload/components/index';
import { BrowserRouter, Route } from 'react-router-dom';
import Download from './scenes/Download/components/index';
import configureStore from './store'
import { Provider } from 'react-redux'
import Settings from './scenes/Portal/Settings/components/index'
import UploadList from './scenes/Portal/UploadList/components/index'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolderPlus, faKey, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import Spinner from 'react-spinkit'
import SignIn from './scenes/Portal/SignIn/components/index';
import Setup from './scenes/Portal/Setup/components/index'

library.add(faFolderPlus, faKey, faEnvelope)

const store = configureStore();

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Suspense fallback={<Spinner />}>
            <div className="App">
              <Route exact path='/' component={Upload} />
              <Route path='/download/:id' component={Download} />
              <Route exact path='/panel' component={UploadList} />
              <Route path='/panel/settings' component={Settings} />
              <Route path='/panel/signin' component={SignIn}/>
              <Route path='/panel/setup' component={Setup}/>
            </div>
          </Suspense>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
