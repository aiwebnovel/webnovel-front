import React, { Component } from 'react';
import {  Route } from 'react-router-dom';
import { Main, Membership } from '../pages/index.js';


class App extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Main}/>
        <Route exact path="/membership" component={Membership}/>
      </div>
    );
  }
}

export default App;