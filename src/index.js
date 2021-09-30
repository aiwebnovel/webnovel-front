import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import Root from './client/root.js';
import { Grommet } from 'grommet';
import { grommet } from 'grommet/themes';


ReactDOM.render(
  <React.StrictMode>
    <Grommet theme={grommet}>
    <Root />
    </Grommet>
  </React.StrictMode>,
  document.getElementById('root')
);