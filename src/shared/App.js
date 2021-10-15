import React, { Component } from 'react';
import {  Route, Switch } from 'react-router-dom';
import { Main, Membership } from '../pages/index.js';


class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Main}/>
        <Route path="/membership" component={Membership}/>
      </Switch>
    );
  }
}

export default App;