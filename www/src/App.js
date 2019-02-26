import React, { Component, Suspense } from 'react';
import Upload from './scenes/Upload/components/index';
import { BrowserRouter, Route } from 'react-router-dom';
import Download from './scenes/Download/components/index';
import configureStore from './store'
import { Provider } from 'react-redux'
import Settings from './scenes/Portal/Settings/components/index'
import UploadList from './scenes/Portal/UploadList/components/index'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import Spinner from 'react-spinkit'

library.add(faFolderPlus)

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
            </div>
          </Suspense>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
