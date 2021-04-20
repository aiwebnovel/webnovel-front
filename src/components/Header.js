import { Component } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../public/firebaseConfig';
import '../style/Header.css';
import usericon from '../public/user.png';
import ProgressBar from "@ramonak/react-progress-bar";

const firebaseApp = firebase.initializeApp(firebaseConfig);

class Header extends Component {
  constructor() {
    super();
    this.state = { 
      showMenu: false,
      userPhoto: ''
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }
  
  showMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('showMenu');
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
    console.log('1showMenu');
    console.log(event.target);

    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false });
      document.removeEventListener('click', this.closeMenu);
    }
  }

  /*
  setImage(user) {
    user = JSON.stringify(user);
    user = JSON.parse(user);
    console.log(user.photoURL);
    console.log(this.props);
    this.setState({ userPhoto: user.photoURL });
  }*/

  render() {
    let { user, signOut, signInWithGoogle } = this.props;    
    return (
      <header>
        <span class="logo">WebNovel</span>
        <p class="beta">Beta</p>
        <div class="loginProfile">
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
                  <p>ho-joon-kim</p>
                </div>
                <div class="token">
                  <ProgressBar completed={50} height="8px" isLabelVisible={false}/>
                  <span>150/300 token</span>
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
