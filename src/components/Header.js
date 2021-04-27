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
  constructor(props) {
    super(props);
    this.state = { 
      showMenu: false,
      userName: '',
      userToken: 1000,
      userTokenP: 100,
      userImage: usericon
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
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
    let user;
    if (this.props.user === undefined) {
      user = localStorage.getItem('token');
    }else{
      user = this.props.user.za;
    }
    if (user !== undefined) {
      axios.get(`${config.SERVER_URL}/profile`, { headers: {authentication: user} })
      .then((response) => {
        this.setState({ userName: response.data.name});
        this.setState({ userToken: response.data.token});
        this.setState({ userTokenP: response.data.tokenP});
        this.setState({ userImage: response.data.photoURL});
      })
      .catch((error) => {
        
      })
    }

  }

  componentDidMount(){
    this.requestProfile();
  }

  async signOut(){
    await this.props.signOut();
    await localStorage.removeItem('token');
  }

  async signIn(){
    await this.props.signInWithGoogle()
  }

  render() {
    let { user } = this.props;  
    return (
      <header>
        <span class="logo">AILyrics (가사,작사,웹시)</span>
        <div class="loginProfile">
          { user ? localStorage.setItem('token', user.za) : null }
          { user ? 
            <div class="profile">
              <a onClick={this.showMenu}>
                <img  src={this.state.userImage} class="profileicon"/>
              </a>
            </div>
            : <button class="login" onClick={this.signIn}>Sign in with Google</button>
          }
          { this.state.showMenu ? (
            <div ref={(element) => { this.dropdownMenu = element; }}>
              <div class="dropdown">
                <div class="name">
                  <p>{this.state.userName}</p>
                </div>
                <div class="token">
                  <ProgressBar completed={this.state.userTokenP} height="8px" isLabelVisible={false}/>
                  <span>{this.state.userToken} token</span>
                </div>
                <button onClick={this.signOut} class="logout">logout</button>
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
