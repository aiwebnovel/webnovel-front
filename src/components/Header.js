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
import Modal from './Modal';

const firebaseApp = firebase.initializeApp(firebaseConfig);



class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      showMenu: false,
      userName: '로그인 되지 않은 사용자',
      userToken: 0,
      userTokenP: 0,
      userImage: usericon,
      modalOpen: false
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
    openModal = () => {
        this.setState({ modalOpen: true })
    }
    closeModal = () => {
        this.setState({ modalOpen: false })
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
        <span class="logo">WebNovel</span>
        <div class="loginProfile">
          
          <button className='links' onClick={ this.openModal }>PRICING</button>
          <Modal open={ this.state.modalOpen } close={ this.closeModal } title="Create a chat room">
              // Modal.js <main> { this.props.children } </main>에 내용이 입력된다. 
              리액트 클래스형 모달 팝업창입니다.
              쉽게 만들 수 있어요. 
              같이 만들어봐요!
          </Modal>
          { user ? localStorage.setItem('token', user.za) : null }
          { user ? console.log(user.za) : null }
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
