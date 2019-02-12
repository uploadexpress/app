import React, { Component } from 'react';
import Upload from './scenes/Upload/components/index';
import { BrowserRouter, Route } from 'react-router-dom';
import Download from './scenes/Download/components/index';
import configureStore from './store'
import { Provider } from 'react-redux'
import Settings from './scenes/Portal/Settings/components/index'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons'

library.add(faFolderPlus)

const store = configureStore();

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>

          <div className="App">
            <Route exact path='/' component={Upload} />
            <Route path='/download/:id' component={Download} />
            <Route path='/portal' component={Settings} />
          </div>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
