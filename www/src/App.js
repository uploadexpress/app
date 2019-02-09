import React, { Component } from 'react';
import Upload from './scenes/Upload/components/index';
import { BrowserRouter, Route } from 'react-router-dom';
import Download from './scenes/Download/components/index';



class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route exact path ='/' component = {Upload} />
          <Route path='/download/:id' component= {Download} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
