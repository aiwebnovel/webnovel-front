import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from '../shared/App.js';
import { ToastContainer, Flip} from 'react-toastify';

const Root = () => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <App/>
    <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        style={{fontSize : '0.85em'}}
        transition={Flip}
        
      />
  </BrowserRouter>
);

export default Root;