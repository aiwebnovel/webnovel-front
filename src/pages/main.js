import React from 'react';
import Header from '../components/Header.js';
import Mainapi from '../components/Main.js';
import Footer from '../components/Footer.js';
import { ToastContainer, Flip} from 'react-toastify';

const Main = () => {

  return (
    <div>
      <Header/>
      <Mainapi/>
      <Footer/>
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
        style={{fontSize : '0.85em' }}
        transition={Flip}
      />
    </div>
  );
};

export default Main;