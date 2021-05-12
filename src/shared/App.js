import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Main, Pricing } from '../pages/index.js';


class App extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Main}/>
        <Route exact path="/pricing" component={Pricing}/>
      </div>
    );
  }
}

export default App;