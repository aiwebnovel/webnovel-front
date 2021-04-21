import { Component } from 'react';
import axios from 'axios';
import withFirebaseAuth from 'react-with-firebase-auth'
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../public/firebaseConfig';
import '../style/Header.css';
import usericon from '../public/user.png';
import ProgressBar from "@ramonak/react-progress-bar";
import * as config from '../config';

const firebaseApp = firebase.initializeApp(firebaseConfig);

class Header extends Component {
  constructor() {
    super();
    this.state = { 
      showMenu: false,
      userName: '',
      userToken: 300
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }
  
  showMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    this.requestProfile();

    if (this.state.showMenu) {
      this.setState({ showMenu: false });
      document.removeEventListener('click', this.closeMenu);
    }else{
      this.setState({ showMenu: true });
      document.addEventListener('click', this.closeMenu);
    }
  }
  
  closeMenu(event) {
    event.preventDefault();

    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false });
      document.removeEventListener('click', this.closeMenu);
    }
  }

  requestProfile() {
    axios.get(`${config.SERVER_URL}/profile`, { headers: {authentication: this.props.user.za} })
    .then((response) => {
      this.setState({ userName: response.data.name});
      this.setState({ userToken: response.data.token});
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render() {
    let { user, signOut, signInWithGoogle } = this.props;  
    return (
      <header>
        <span class="logo">WebNovel</span>
        <p class="beta">Beta</p>
        <div class="loginProfile">
          { user ? localStorage.setItem('token', user.za) : null }
          { user ? 
            <div class="profile">
              <a onClick={this.showMenu}>
                <img  src={usericon} class="profileicon"/>
              </a>
            </div>
            : <button class="login" onClick={signInWithGoogle}>Sign in with Google</button>
          }
          { this.state.showMenu ? (
            <div ref={(element) => { this.dropdownMenu = element; }}>
              <div class="dropdown">
                <div class="name">
                  <p>{this.state.userName}</p>
                </div>
                <div class="token">
                  <ProgressBar completed={this.state.userToken} height="8px" isLabelVisible={false}/>
                  <span>{this.state.userToken} token</span>
                </div>
                <button onClick={signOut} class="logout">logout</button>
              </div>
            </div> ) : (null)
          }
        </div>
      </header>
    );
  }
}

const firebaseAppAuth = firebaseApp.auth();
const providers = { googleProvider: new firebase.auth.GoogleAuthProvider(), };

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(Header);
