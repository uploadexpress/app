import React, { Component } from 'react';
import Upload from './scenes/Upload/components/index';
import { BrowserRouter, Route } from 'react-router-dom';
import Download from './scenes/Download/components/index';
import configureStore from './store'
import { Provider } from 'react-redux'

const store = configureStore();

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <div className="App">
            <Route exact path='/' component={Upload} />
            <Route path='/download/:id' component={Download} />
          </div>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
